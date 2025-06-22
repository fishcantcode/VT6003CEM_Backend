import { Request, Response } from 'express';
import { z } from 'zod';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Hotel, User, Favorite } from '../models';
import { sequelize } from '../config/database';

const hotelSchema = z.object({
  formatted_address: z.string(),
  geometry: z.object({
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  name: z.string(),
  place_id: z.string(),
  rating: z.number(),
  user_ratings_total: z.number(),
  compound_code: z.string().optional(),
  vicinity: z.string().optional(),
  status: z.enum(['available', 'unavailable']).default('available'),
});

export const hotelConnectionTest = (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Hotel controller connection successful' });
};

export const getAllHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotels = await Hotel.findAll();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getHotelByPlaceId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { place_id } = req.params;
    const hotel = await Hotel.findOne({ where: { place_id } });
    
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }
    
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = hotelSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
      return;
    }
    
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    if ((error as any).name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Hotel with this place_id already exists' });
      return;
    }
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateHotelByPlaceId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { place_id } = req.params;
    const validation = hotelSchema.partial().safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
      return;
    }

    const hotel = await Hotel.findOne({ where: { place_id } });

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    await hotel.update(validation.data);
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteHotelByPlaceId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { place_id } = req.params;
    const hotel = await Hotel.findOne({ where: { place_id } });

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }
    
    await hotel.destroy();
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getHotelsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;
    
    if (!status || !['available', 'unavailable'].includes(status)) {
      res.status(400).json({ message: 'Valid status parameter is required (available, unavailable)' });
      return;
    }
    
    const hotels = await Hotel.findAll({
      where: { status }
    });
    
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const setHotelStatusByPlaceId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { place_id } = req.params;
    const { status } = req.body;


    if (!status || !['available', 'unavailable'].includes(status)) {
      res.status(400).json({ message: 'Invalid status provided. Must be one of: available, unavailable' });
      return;
    }

    const hotel = await Hotel.findOne({ where: { place_id } });

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }


    hotel.status = status;
    await hotel.save();

    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAvailableHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotels = await Hotel.findAll({
      where: { status: 'available' }
    });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyFavoriteHotels = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({
      where: { email: userEmail },
      include: [{
        model: Hotel,
        as: 'favoriteHotels',
        attributes: ['id', 'place_id', 'name', 'formatted_address', 'rating', 'user_ratings_total', 'vicinity'],
        through: { attributes: [] } // Don't include the Favorite join table attributes
      }]
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user.favoriteHotels || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addHotelToFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email;
    const { place_id } = req.params;

    if (!userEmail) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ where: { email: userEmail } });
    const hotel = await Hotel.findOne({ where: { place_id } });

    if (!user || !hotel) {
      res.status(404).json({ message: 'User or Hotel not found' });
      return;
    }


    const [results, metadata] = await sequelize.query(
      'INSERT INTO "favorites" ("user_id", "hotel_id", "created_at", "updated_at") VALUES (:userId, :hotelId, NOW(), NOW()) ON CONFLICT DO NOTHING',
      {
        replacements: { userId: user.id, hotelId: hotel.id },
        type: 'INSERT'
      }
    );

    res.status(201).json({ message: 'Hotel added to favorites' });

  } catch (error) {
    console.error('Error in addHotelToFavorites:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeHotelFromFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email;
    const { place_id } = req.params;

    if (!userEmail) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ where: { email: userEmail } });
    const hotel = await Hotel.findOne({ where: { place_id } });

    if (!user || !hotel) {
      res.status(404).json({ message: 'User or Hotel not found' });
      return;
    }

    await Favorite.destroy({
      where: {
        user_id: user.id,
        hotel_id: hotel.id
      }
    });

    res.status(200).json({ message: 'Hotel removed from favorites' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query;
    
    if (!name || typeof name !== 'string') {
      res.status(400).json({ message: 'Name parameter is required' });
      return;
    }
    
    const hotels = await Hotel.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    });
    
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

import { Router } from 'express';
import { 
  hotelConnectionTest,
  getAllHotels, 
  getHotelByPlaceId, 
  createHotel, 
  updateHotelByPlaceId, 
  deleteHotelByPlaceId, 
  searchHotels,
  getHotelsByStatus,
  setHotelStatusByPlaceId,
  getAvailableHotels,
  getMyFavoriteHotels,
  addHotelToFavorites,
  removeHotelFromFavorites
} from '../controllers/hotel.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/connection-test', hotelConnectionTest);
router.get('/', getAllHotels);
router.get('/search', searchHotels);
router.get('/available', getAvailableHotels);
router.get('/favorites', authenticateToken, getMyFavoriteHotels);
router.get('/status/:status', getHotelsByStatus);
router.get('/place/:place_id', getHotelByPlaceId);
router.post('/', authenticateToken, createHotel);
router.put('/place/:place_id', authenticateToken, updateHotelByPlaceId);
router.delete('/place/:place_id', authenticateToken, deleteHotelByPlaceId);
router.patch('/place/:place_id/status', authenticateToken, setHotelStatusByPlaceId);

 
router.post('/place/:place_id/favorite', authenticateToken, addHotelToFavorites);
router.delete('/place/:place_id/favorite', authenticateToken, removeHotelFromFavorites);

export default router;

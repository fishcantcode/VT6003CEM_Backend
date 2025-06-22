import { User, UserAttributes } from './user.model';
import { Hotel } from './hotel.model';
import { Favorite } from './favorite.model';

 
User.belongsToMany(Hotel, { 
  through: Favorite, 
  foreignKey: 'userId', 
  as: 'favoriteHotels' 
});

Hotel.belongsToMany(User, { 
  through: Favorite, 
  foreignKey: 'hotelId', 
  as: 'favoritedBy' 
});

 
export {
  User,
  Hotel,
  Favorite,
  UserAttributes
};

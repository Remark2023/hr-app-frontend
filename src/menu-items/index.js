import dashboard from './dashboard';
// import pages from './pages';
import OtherMenu from './other'; // Import the updated OtherMenu function
// import utilities from './utilities';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, OtherMenu()] // Call OtherMenu to get the dynamically generated menu group
};

export default menuItems;

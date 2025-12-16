import { BrandingConfig } from './branding.config';

export const AppConstants = {
  // Dish types
  DISH_TYPES: {
    1: 'Primer Plat',
    2: 'Segont Plat',
    3: 'Postre',
  },

  // Order status
  ORDER_STATUS: {
    PENDING: { value: 1, label: 'Pendent' },
    IN_PREPARATION: { value: 2, label: 'En preparació' },
    DELIVERED: { value: 3, label: 'Entregat' },
    NOT_COLLECTED: { value: 4, label: 'No recollit' },
  },

  // Order status list for dropdowns
  ORDER_STATUS_OPTIONS: [
    { value: 1, label: 'Pendent' },
    { value: 2, label: 'En preparació' },
    { value: 3, label: 'Entregat' },
    { value: 4, label: 'No recollit' },
  ],

  // User status
  USER_STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
  },

  // Default order status
  DEFAULT_ORDER_STATUS_ID: 1,

  // Storage keys
  STORAGE_KEYS: {
    USER: 'user',
    IS_ADMIN: 'isAdmin',
  },

  // Email domains
  EMAIL_DOMAINS: {
    GINEBRO: BrandingConfig.EMAIL.DOMAIN,
  },

  // Import template paths
  IMPORT_TEMPLATES: {
    MENUS: '/import_templates/import_menus_example.json',
    USERS: '/import_templates/import_users_example.json',
  },

  // Import descriptions
  IMPORT_DESCRIPTIONS: {
    MENUS: "Importar menus des d'un arxiu JSON",
    USERS: "Importar usuaris des d'un arxiu JSON",
  },
};

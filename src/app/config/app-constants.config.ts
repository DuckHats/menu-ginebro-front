import { BrandingConfig } from './branding.config';

export const AppConstants = {
  // Dish types
  DISH_TYPES: {
    1: 'Primer plat',
    2: 'Segon plat',
    3: 'Postres',
  },  // Order status
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
    MENUS_CSV: '/import_templates/import_menus_example.csv',
    USERS: '/import_templates/import_users_example.json',
  },

  // Import descriptions
  IMPORT_DESCRIPTIONS: {
    MENUS: "Importar menus des d'un arxiu JSON o CSV",
    USERS: "Importar usuaris des d'un arxiu JSON",
  },

  // Configuration constants
  CONFIGURATION: {
    TABS: {
      IMAGES: 'imatges',
      ORDERS: 'comandes',
      STATUS: 'estat',
      REDSYS: 'pagaments',
      CONFIG: 'config',
    },
    LABELS: {
      TITLE: 'Configuració del Sistema',
      SUBTITLE: 'Gestiona els paràmetres globals i contingut dinàmic',
      IMAGES_TAB: 'Imatges Menú',
      ORDERS_TAB: 'Comandes i Preus',
      STATUS_TAB: "Estat de l'App",
      REDSYS_TAB: 'Pagaments (Redsys)',
      CONFIG_TAB: 'Configuració',
      IMAGES_TITLE: 'Imatges dels Menús Mensuals',
      IMAGES_DESC: 'Puja les imatges dels menús perquè els usuaris les puguin consultar.',
      IMG_START_DATE: 'Inici visibilitat',
      IMG_END_DATE: 'Final visibilitat',
      NEW_IMG_START: 'Nova Data Inici',
      NEW_IMG_END: 'Nova Data Fi',
      SAVE_IMAGE: 'Desar',
      UPLOAD_NEW: 'Puja una nova imatge',
      UPLOAD_BUTTON: 'Pujar imatge',
      UPLOADING_BUTTON: 'Pujant...',
      UPLOADING: 'Pujant...',
      ORDERS_TITLE: 'Configuració de Comandes',
      DEADLINE_TIME: 'Hora límit de comanda',
      DEADLINE_TIME_DESC: "Si els dies d'antelació són 0, aquesta hora s'aplica per a comandes del mateix dia. Si és major que 0, l'hora s'ignora ja que prevalen els dies d'antelació.",
      DAYS_AHEAD: "Dies d'antelació",
      DAYS_AHEAD_DESC: "Quants dies abans s'ha de tancar la comanda. Si és 0, es pot demanar per al mateix dia fins a l'hora límit.",
      MENU_PRICE: 'Preu del menú (€)',
      MENU_PRICE_DESC: 'Preu per tiquet de menú.',
      SAVE_CHANGES: 'Guardar Canvis',
      SAVING: 'Guardant...',
      APP_STATUS_TITLE: "Estat de l'Aplicació",
      APP_STATUS_DESC: "Si desactives l'aplicació, els usuaris veuran una pàgina de manteniment.",
      APP_ACTIVE: 'Aplicació Activa',
      APP_ACTIVE_DESC: "L'aplicació està funcionant normalment",
      APP_INACTIVE_DESC: "L'aplicació està en manteniment",
      MAINTENANCE_TITLE: 'Estem en manteniment',
      MAINTENANCE_DESC: "Estem realitzant algunes millores al sistema per oferir-te un millor servei. Torna a intentar-ho d'aquí a una estona.",
      REDSYS_TITLE: 'Configuració de Passarel·la Redsys',
      REDSYS_DESC: 'Configura les claus i paràmetres de connexió amb Redsys.',
      REDSYS_URL: 'URL de l\'Entorn (Proves/Real)',
      REDSYS_CODE: 'Codi de Comerç (FUC)',
      REDSYS_TERMINAL: 'Terminal',
      REDSYS_KEY: 'Clau Secreta (SHA-256)',
      MAINTENANCE_FOOTER: 'Gràcies per la teva paciència',
      ADMIN_DASHBOARD: {
        TITLE: 'Panell de Control',
        TABS: {
          ORDERS: 'ordres',
          MENUS: 'menus',
          USERS: 'usuaris',
        },
        LABELS: {
          ORDERS: 'Ordres',
          MENUS: 'Menús',
          USERS: 'Usuaris',
        },
        ORDERS: {
          TITLE: 'Gestió d\'Ordres',
          EXPORT: 'Exportar',
          PREVIOUS_DAY: 'Dia anterior',
          NEXT_DAY: 'Dia següent',
          TABLE: {
            USER: 'Usuari',
            EMAIL: 'Email',
            DATE: 'Data',
            TYPE: 'Tipus',
            ALLERGIES: 'Al·lèrgies',
            FIRST_DISH: 'Primer plat',
            SECOND_DISH: 'Segon plat',
            DESSERT: 'Postre',
            STATUS: 'Estat',
            TUPPER: 'Tupper',
          },
          NO_ORDERS: 'No s\'han trobat ordres per a la data seleccionada.',
        },
        MENUS: {
          TITLE: 'Gestió de Menús',
          PREVIOUS_WEEK: 'Setmana anterior',
          NEXT_WEEK: 'Setmana següent',
          IMPORT: 'Importar menús',
          NO_MENUS: 'No hi han menús per a la data seleccionada',
        },
        USERS: {
          TITLE: 'Gestió d\'Usuaris',
          IMPORT: 'Importar usuaris',
          TABLE: {
            ID: 'ID',
            NAME: 'Nom',
            LAST_NAME: 'Cognoms',
            EMAIL: 'Email',
            STATUS: 'Estat',
          },
          ACTIVE: 'Actiu',
          INACTIVE: 'Inactiu',
        },
      }
    }
  }
} as const;

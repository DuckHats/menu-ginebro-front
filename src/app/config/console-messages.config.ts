export const ConsoleMessages = {
  ERRORS: {
    STUDENT_NOT_FOUND: 'Student not found in localStorage',
    NO_SESSION: 'No hay sesión activa',
    AUTH_FAILED: 'Autenticación fallida',
    NO_CACHED_USER: 'No cached user available',
    LOADING_ORDER_TYPES: 'Error loading order types:',
    LOADING_MENU: 'Error loading menu:',
    LOADING_USERS: 'Error loading users:',
    FETCHING_USER: 'Error fetching user:',
    FETCHING_ORDERS: 'Failed to fetch orders',
    PARSING_OPTIONS: (dishId: number) =>
      `Error parsing options for dish ID ${dishId}:`,
    NO_MENU_FOR_DATE: (date: string) => `No menu found for date: ${date}`,
    FETCHING_MENU_FOR_DATE: (date: string) =>
      `Error fetching menu for date ${date}:`,
  },

  LOGS: {
    MENUS_SERVICE_ERROR: 'MenusService error:',
  },
};

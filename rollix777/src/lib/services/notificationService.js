import { baseUrl } from '../config/server.js';

export const createNotification = async (notificationData) => {
  try {
    const response = await fetch(`${baseUrl}/api/notifications/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getArg = (args: any, key: string, required: boolean = true): string => {
  const value = args?.[key];
  if (required && (value === undefined || value === null)) {
    throw new Error(`Missing required argument: ${key}`);
  }
  return String(value || '');
};

export const getOptionalArg = (args: any, key: string): string | undefined => {
  const value = args?.[key];
  return value !== undefined && value !== null ? String(value) : undefined;
};

export const getNumberArg = (args: any, key: string, required: boolean = true): number => {
  const value = args?.[key];
  if (required && (value === undefined || value === null)) {
    throw new Error(`Missing required argument: ${key}`);
  }
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid number for argument: ${key}`);
  }
  return num;
};

export const createSuccessResponse = (text: string) => ({
  content: [
    {
      type: "text",
      text,
    },
  ],
});

export const createJsonResponse = (data: any) => ({
  content: [
    {
      type: "text",
      text: JSON.stringify(data, null, 2),
    },
  ],
});
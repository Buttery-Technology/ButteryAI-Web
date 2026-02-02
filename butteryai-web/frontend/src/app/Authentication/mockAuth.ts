import { mockUser } from "./mockUser.ts";

export const mockGoogleSignIn = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    name: mockUser.name,
    email: mockUser.email,
    password: mockUser.password,
  };
};

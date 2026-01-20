export const API_URL = "https://dogsapi.origamid.dev/json";
export const BUTTERY_API_URL = "http://localhost:3001/api";

export const POST_TOKEN = (body: unknown) => {
  return {
    url: API_URL + "/jwt-auth/v1/token",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
};

export const VALIDATE_TOKEN = (token: string) => {
  return {
    url: API_URL + "/jwt-auth/v1/token/validate",
    options: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  };
};

export const GET_USER = (token: string) => {
  return {
    url: API_URL + "/api/user",
    options: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  };
};

export const POST_USER = (body: unknown) => {
  return {
    url: API_URL + "/api/user",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
};

// Waitlist API
export const CHECK_WAITLIST_APPROVAL = (email: string) => {
  return {
    url: BUTTERY_API_URL + "/waitlist/check",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  };
};

export const JOIN_WAITLIST = (name: string, email: string, buildDescription?: string) => {
  return {
    url: BUTTERY_API_URL + "/waitlist/join",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, buildDescription }),
    },
  };
};

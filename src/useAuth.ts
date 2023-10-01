import {
  AccessTokenRequestConfig,
  ResponseType,
  TokenResponse,
  exchangeCodeAsync,
  revokeAsync,
  useAuthRequest,
} from "expo-auth-session";
import { useEffect, useMemo, useState } from "react";

const clientId = process.env.EXPO_PUBLIC_CLIENT_ID || "";
const userPoolUrl = process.env.EXPO_PUBLIC_USER_POOL_URL || "";
const redirectUri = process.env.EXPO_PUBLIC_REDIRECT_URI || "";

export const useAuth = () => {
  const [authTokens, setAuthTokens] = useState<TokenResponse | null>(null);
  const discoveryDocument = useMemo(
    () => ({
      authorizationEndpoint: userPoolUrl + "/oauth2/authorize",
      tokenEndpoint: userPoolUrl + "/oauth2/token",
      revocationEndpoint: userPoolUrl + "/oauth2/revoke",
    }),
    []
  );

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
    },
    discoveryDocument
  );

  useEffect(() => {
    const exchangeFn = async (exchangeTokenReq: AccessTokenRequestConfig) => {
      try {
        const exchangeTokenResponse = await exchangeCodeAsync(
          exchangeTokenReq,
          discoveryDocument
        );
        setAuthTokens(exchangeTokenResponse);
      } catch (error) {
        console.error(error);
      }
    };
    if (response) {
      if (response.type === "success" && request?.codeVerifier) {
        exchangeFn({
          clientId,
          code: response.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        });
      }
    }
  }, [discoveryDocument, request, response]);

  const logout = async () => {
    if (authTokens?.refreshToken) {
      const revokeResponse = await revokeAsync(
        {
          clientId: clientId,
          token: authTokens.refreshToken,
        },
        discoveryDocument
      );
      if (revokeResponse) {
        setAuthTokens(null);
      }
    }
  };
  console.log("authTokens: " + JSON.stringify(authTokens));

  return {
    authTokens,
    request,
    logout,
    promptAsync,
  };
};

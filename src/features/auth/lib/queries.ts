"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as authApi from "@/features/auth/lib/api";
import { authKeys } from "@/features/auth/lib/query-keys";

export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: authApi.getSession,
    staleTime: 60_000,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session(), { user: null });
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.requestPasswordReset,
  });
}

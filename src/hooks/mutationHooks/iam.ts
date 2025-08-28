import { useMutation } from '@tanstack/react-query'
import { performLogin, performRegister } from '../../apis/iam'

export function useLogin() {
  return useMutation({
    mutationFn: performLogin,
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: performRegister,
  })
}

export const useDelay = () => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

  return { delay }
}

import { useI18n } from 'vue-i18n'
import type { MessageSchema } from '../plugins/i18n'

export const useTypedI18n = () => {
  return useI18n<{
    message: MessageSchema
  }>({
    useScope: 'global',
    inheritLocale: true,
  })
}

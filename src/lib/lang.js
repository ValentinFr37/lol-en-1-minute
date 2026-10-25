// Langue courante, accessible partout dans l'application sans la passer de composant en composant.
import { createContext, useContext } from 'react'
import { DEFAULT_LANG, t } from '../i18n.js'

export const LangContext = createContext(DEFAULT_LANG)

export const useLang = () => useContext(LangContext)

// Textes de l'interface dans la langue courante.
export const useT = () => t(useContext(LangContext))

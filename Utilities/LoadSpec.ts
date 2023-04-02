import { CompletionSpec } from '../types/Query'

export const loadCompletionSpec = async (
  commandName: string | undefined
): Promise<CompletionSpec | null> => {
  const url = `https://cdn.skypack.dev/@withfig/autocomplete/build/${commandName}.js`

  try {
    const specModule = await import(/* webpackIgnore: true */ url)

    return specModule.default as CompletionSpec
  } catch (e) {
    return null
  }
}

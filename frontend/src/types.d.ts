declare module '*.svg'

declare module '~/assets/svg/*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export = value
}

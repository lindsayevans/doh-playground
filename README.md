# DoH Playground

> Created with [scffld](https://www.npmjs.com/package/@scffld/cli) and the [React web app template](https://github.com/scffld-dev/website/blob/main/templates/react-parcel-app.md)

## Setup

Corepack is optional - see https://nodejs.org/api/corepack.html#corepack for details

```sh
corepack enable && corepack use pnpm@latest
pnpm install
```

## Local development

```sh
pnpm start
```

App will be available at: http://localhost:1234

## Testing

```sh
pnpm test
pnpm test -- --watch
```

## Linting

```sh
pnpm run lint
pnpm run lint:fix
```

## Production build

```sh
pnpm run build
```

Files will be in: `./dist/`

## Features

### Code generation

```sh
pnpm run g:component -- --name="My Thing"
```

Uses [scffld](https://www.npmjs.com/package/@scffld/cli) to generate React components

To see all available options:

```sh
pnpm run g:component -- --help
```

## Unit Testing

With [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### [React Router](https://reactrouter.com/)

### [Mantine UI component library](https://mantine.dev/)

Including a [theme switcher component](./src/components/ThemeToggle)

### [Bootstrap Icons](https://icons.getbootstrap.com/)

via [React Bootstrap Icons](https://www.npmjs.com/package/react-bootstrap-icons)

# Headless React Table (alpha)

## Quick Features

- Lightweight at 3kb
- 100% TypeScript, but not required (you can use JS if you want)
- Headless (100% customizable, Bring-your-own-UI)
- Row Selection
- Row Expansion
- Pagination

## Demo

> [Visit site with example](https://rtable.vercel.app)

## Quickstart

```bash
pnpm add rtable
# or
yarn add rtable
# or
npm i rtable
```

Then, import and use individual components:

```jsx
import RTable from 'r-table';

<RTable rows={[]} columns={[]}/>
```

### Properties

| Property      | Type                                        | Description                                 |
|---------------|---------------------------------------------|:--------------------------------------------|
| height        | string/number                               | Height of body component. Needed for scroll |          
| rows          | NonNullable<Array<{ [name: string]: any }>> | Table data                                  |
| columns       |                                             | Columns of the table                        |
| columns.key   | string                                      | key  of the row. For example name or lastName   |
| columns.type  | 'text'                                      | 'number' | 'date'                                               |            Types of column value                                     |
|               |                                             |                                                 |

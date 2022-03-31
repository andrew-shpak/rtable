import 'react-app-polyfill/ie11';
import * as React from 'react';
import RTable from '../src';
import './main.css';
import { createRoot } from 'react-dom/client';
import Tooltip from '@reach/tooltip';
import '@reach/tooltip/styles.css';
import '@reach/dialog/styles.css';

const App = () => {
  const [data, setData] = React.useState([
    { name: 'name1', id: 'name1' },
    { name: 'name2', id: 'name2' },
    { name: 'name3', id: 'name3' },
  ]);
  const Actions = (props: {
    ids: string[];
    indexes: number[];
    clearCheckedRows: () => void;
  }) => {
    const { ids, indexes, clearCheckedRows } = props;
    const nextIndex = data.length + 1;
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <button
          className={'btn btn-success'}
          onClick={() => {
            data.push({
              name: nextIndex + 'name',
              // lastName: nextIndex,
              // middleName: nextIndex,
              id: nextIndex + 'name',
            });
          }}
        >
          Додати
        </button>
        <button
          className={'btn btn-danger'}
          disabled={ids.length === 0}
          onClick={() => {
            indexes.forEach((index) => data.splice(index, 1));
            setData([...data]);
            clearCheckedRows();
          }}
        >
          Видалити
        </button>
      </div>
    );
  };
  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <RTable
          classNames={{
            table: 'table',
            column: 'column',
            header: 'header',
            body: 'body',
            row: 'row',
          }}
          selection={{
            checkbox: 'checkbox',
          }}
          pagination={{
            previousPageClassName: 'btn-icon',
            nextPageClassName: 'btn-icon',
            of: 'з',
          }}
          toolbar={{
            visible: true,
            className: 'toolbar',
            search: {
              placeholder: 'Введіть текст',
              className: 'search',
            },
            actions: (params) => (
              <Actions
                ids={params.ids}
                clearCheckedRows={params.clearCheckedRows}
                indexes={params.ids.map((f) =>
                  data.findIndex((x) => x.id.toString() === f)
                )}
              />
            ),
          }}
          rows={data}
          height={'70vh'}
          columns={[
            {
              key: 'name',
              title: 'aets',
              width: '1000px',
              filtered: false,
              render: (params) => {
                return (
                  <Tooltip label="Save">
                    <span>{params.value}</span>
                  </Tooltip>
                );
              },
            },
            // {
            //   key: 'lastName',
            //   title: 'aets',
            //   flex: 1,
            //   sorted: false,
            // },
            // {
            //   key: 'middleName',
            //   title: 'aets',
            //   width: '1000px',
            // },
          ]}
          extend={{
            className: 'extended',
            render: ({ row, rowIndex }) => {
              if (row.id === 1) return null;
              return '1';
            },
          }}
          filters={{
            onClick: () => {},
            isActive: () => true,
          }}
        />
      </div>
    </div>
  );
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

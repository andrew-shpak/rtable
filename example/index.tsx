import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RTable from '../src';
import './main.css';
import { render } from 'react-dom';

const Actions = (props: { checked: string[] }) => {
  const { checked } = props;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <button className={'btn btn-success'} onClick={() => {}}>
        Додати
      </button>
      <button className={'btn btn-danger'} disabled={checked.length === 0}>
        Видалити
      </button>
      {/*{toolbar?.columns && (
                <button
                    className={toolbar.columns.className}
                    onClick={() => {
                        setVisibleColumns([]);
                    }}
                >
                    Колонки
                </button>
            )}
            {toolbar?.filters && (
                <button
                    style={{
                        marginRight: '1rem',
                    }}
                    className={toolbar.filters.className}
                >
                    Фільтри
                </button>
            )}*/}
    </div>
  );
};
/*
*  add: {
                            className: "btn btn-success",
                            title:"Додати",
                            onClick: () => {

                            }
                        },
                        remove: {
                            title:"Видалити",
                            className: "btn btn-danger",
                            onClick: (ids) => {

                            }
                        },
                        columns: {
                            className: "btn btn-info",
                        },
                        filters: {
                            className: "btn btn-primary",
                        },
* */
const App = () => {
  const range = [...Array.from(Array(100).keys())];
  const data = React.useMemo(
    () =>
      range.map((i) => {
        return {
          name: i,
          lastName: i,
          middleName: i,
          id: i,
        };
      }),
    []
  );
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
          onSearchInputChanged={(value) => {
            console.log(value, '1');
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
            actions: (params) => <Actions checked={params.ids} />,
          }}
          rows={data}
          height={'70vh'}
          columns={[
            {
              key: 'name',
              title: 'aets',
              width: '1000px',
            },
            {
              key: 'lastName',
              title: 'aets',
              width: '1000px',
            },
            {
              key: 'middleName',
              title: 'aets',
              width: '1000px',
            },
          ]}
          extend={{
            className: 'extended',
            render: ({ row, rowIndex }) => {
              if (row.id === 1) return null;
              return '1';
            },
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

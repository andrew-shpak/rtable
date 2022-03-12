import * as React from 'react';
import { Order, RTableProps } from './types';

export default function RTable(props: RTableProps) {
  const {
    columns,
    getRowId = (row: { [key: string]: any }) => row.id,
    classNames,
    pagination = {},
    toolbar = { visible: true },
    selection = {
      visible: true,
    },
  } = props;
  const {
    rowsPerPage = [5, 10, 20, 50, 100],
    defaultRowsPerPage = 10,
    of = 'of',
  } = pagination;

  const headerScroll = React.useRef<HTMLDivElement>(null);
  const bodyScroll = React.useRef<HTMLDivElement>(null);

  const [take, setTake] = React.useState<number>(defaultRowsPerPage);
  const [page, setPage] = React.useState<number>(0);
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(
    columns.map((f) => f.key)
  );
  // selection
  const [checked, setChecked] = React.useState<string[]>([]);
  const allIds = React.useMemo(
    () => props.rows.map((row: any) => getRowId(row)),
    [props.rows, getRowId]
  );
  // Sorting
  const [orderBy, setOrderBy] = React.useState<
    { column: string; direction: Order; type: 'text' | 'number' | 'date' }[]
  >([]);
  const rows = React.useMemo(() => {
    let result = props.rows;
    orderBy.forEach((order) => {
      result = stableSort(result, getComparator(order.direction, order.column));
    });
    return result;
  }, [props.rows, orderBy]);
  return (
    <div className={classNames?.table ?? ''}>
      <div
        className={toolbar?.className ?? ''}
        style={{
          display: 'inline-flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ flex: '1 0 0' }}>
          {toolbar?.actions &&
            toolbar?.actions({
              ids: checked,
            })}
        </div>
        <div style={{ width: '20%' }}>
          <input
            placeholder={toolbar?.search?.placeholder ?? 'Enter text'}
            className={toolbar?.search?.className ?? ''}
            type={'search'}
          />
        </div>
      </div>
      <div
        style={{
          overflowY: 'auto',
        }}
        className={classNames?.header ?? ''}
        ref={headerScroll}
        onScroll={(scroll: React.UIEvent<HTMLDivElement>) => {
          if (bodyScroll?.current)
            bodyScroll.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {(selection?.visible || selection.checkbox) && (
            <div
              style={{
                flex: `0 0  auto`,
              }}
              className={classNames?.column ?? ''}
            >
              <input
                className={selection?.checkbox ?? ''}
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      checked.length > 0 && checked.length !== rows.length;
                  }
                }}
                checked={checked.length === rows.length}
                onChange={() => {
                  if (checked.length === rows.length) setChecked([]);
                  else setChecked(allIds);
                }}
                type="checkbox"
              />
            </div>
          )}
          {columns.map((column, columnIndex) => {
            if (!visibleColumns.includes(column.key)) return null;
            const type = column.type ?? 'text';
            const flex = `${column.flex ?? 0} 0 ${column.width ?? 'auto'}`;
            const sortItem = orderBy.find((f) => f.column === column.key);
            return (
              <div
                style={{
                  flex,
                  display: 'flex',
                  textAlign: type === 'number' ? 'right' : 'left',
                  cursor: 'pointer',
                  alignItems: 'center',
                }}
                key={`${column.key}_${columnIndex}`}
                className={`${column?.className ?? ''} ${
                  classNames?.column ?? ''
                }`}
                onClick={() => {
                  if (sortItem) {
                    const newArray = orderBy.filter(
                      (f) => f.column !== column.key
                    );
                    if (sortItem.direction === 'asc') {
                      setOrderBy([
                        ...newArray,
                        { column: column.key, direction: 'desc', type },
                      ]);
                    } else {
                      setOrderBy(newArray);
                    }
                  } else {
                    setOrderBy([
                      ...orderBy,
                      { column: column.key, direction: 'asc', type },
                    ]);
                  }
                }}
              >
                {column.title}{' '}
                {sortItem?.direction === 'asc' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#18181b"
                    viewBox="0 0 256 256"
                  >
                    <rect width="16" height="16" fill="none"></rect>
                    <line
                      x1="128"
                      y1="216"
                      x2="128"
                      y2="40"
                      fill="none"
                      stroke="#18181b"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="24"
                    ></line>
                    <polyline
                      points="56 112 128 40 200 112"
                      fill="none"
                      stroke="#18181b"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="24"
                    />
                  </svg>
                )}
                {sortItem?.direction === 'desc' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#18181b"
                    viewBox="0 0 256 256"
                  >
                    <rect width="16" height="16" fill="none" />
                    <line
                      x1="128"
                      y1="40"
                      x2="128"
                      y2="216"
                      fill="none"
                      stroke="#18181b"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="24"
                    />
                    <polyline
                      points="56 144 128 216 200 144"
                      fill="none"
                      stroke="#18181b"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="24"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={classNames?.body ?? ''}
        style={{
          overflowY: 'auto',
        }}
        ref={bodyScroll}
        onScroll={(scroll: React.UIEvent<HTMLDivElement>) => {
          if (headerScroll?.current)
            headerScroll.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }}
      >
        {rows
          .slice(page * take, page * take + take)
          .map((row: any) => {
            const key = getRowId(row);
            const rowChecked = checked.includes(key);
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                className={classNames?.row ?? ''}
                key={key}
              >
                {(selection?.visible || selection?.checkbox) && (
                  <div
                    style={{
                      flex: `0 0 auto`,
                    }}
                    className={classNames?.column ?? ''}
                  >
                    <input
                      className={selection?.checkbox ?? ''}
                      checked={rowChecked}
                      onChange={() => {
                        if (rowChecked) {
                          setChecked(checked.filter((f) => f !== key));
                        } else {
                          setChecked([...checked, key]);
                        }
                      }}
                      type="checkbox"
                    />
                  </div>
                )}
                {columns.map((column) => {
                  if (!visibleColumns.includes(column.key)) return null;
                  const flex = `${column.flex ?? 0} 0 ${
                    column.width ?? 'auto'
                  }`;
                  const title = row[column.key];
                  return (
                    <div
                      style={{
                        flex,
                        textAlign: column.type === 'number' ? 'right' : 'left',
                      }}
                      key={`${column.key}_${key}`}
                      className={`${column?.className ?? ''} ${
                        classNames?.column ?? ''
                      }`}
                    >
                      {title}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
      <div
        style={{
          width: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <select
          defaultValue={take}
          onChange={(event) => {
            setTake(parseInt(event.target.value, 10));
          }}
        >
          {rowsPerPage?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          placeholder={'Enter page number'}
          style={{
            width: '10%',
          }}
        />
        <span>
          {take * page + 1}-
          {rows.length < take ? rows.length : take * page + take} {of}{' '}
          {rows.length}
        </span>
        <div>
          {pagination?.previousPage ? (
            pagination?.previousPage
          ) : (
            <button
              disabled={page === 0}
              className={pagination?.previousPageClassName ?? ''}
              onClick={() => {
                if (page > 0) setPage((state) => state - 1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#171717"
                viewBox="0 0 256 256"
              >
                <rect width="256" height="256" fill="none"></rect>
                <polyline
                  points="160 208 80 128 160 48"
                  fill="none"
                  stroke="#171717"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                ></polyline>
              </svg>
            </button>
          )}
        </div>
        <div>
          {pagination.nextPage ? (
            pagination.nextPage
          ) : (
            <button
              className={pagination?.nextPageClassName ?? ''}
              disabled={take * page + take >= rows.length}
              onClick={() => setPage((state) => state + 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#171717"
                viewBox="0 0 256 256"
              >
                <rect width="256" height="256" fill="none"></rect>
                <polyline
                  points="96 48 176 128 96 208"
                  fill="none"
                  stroke="#171717"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                ></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

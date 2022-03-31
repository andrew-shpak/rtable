import * as React from 'react';
import { Order, RTableColumnProps, RTableModel, RTableProps } from './types';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
} from './icons';
import { getComparator, stableSort } from './utils';
export default function RTable(props: RTableProps) {
  const {
    columns,
    height,
    getRowId = (row: { [key: string]: any }) => row.id,
    classNames,
    pagination = {},
    toolbar = { visible: true },
    selection = {
      visible: true,
    },
    extend,
    onSearchInputChanged,
    filters,
  } = props;
  const {
    rowsPerPage = [5, 10, 20, 50, 100],
    defaultRowsPerPage = 10,
    of = 'of',
  } = pagination;

  // Sync scroll
  const headerScroll = React.useRef<HTMLDivElement>(null);
  const bodyScroll = React.useRef<HTMLDivElement>(null);

  // Global search
  const [search, setSearch] = React.useState<string>('');
  const [globalSearchValue, getGlobalSearchValue] = React.useState<string>('');
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getGlobalSearchValue(search);
    }, 600);
    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  React.useEffect(() => {
    if (onSearchInputChanged) onSearchInputChanged(globalSearchValue);
  }, [globalSearchValue, onSearchInputChanged]);

  const showRowFn = React.useCallback(
    (row: RTableModel, searchValue: string) =>
      Object.values(row).some((f) => f.toString().includes(searchValue)),
    []
  );

  const filteredRows = React.useMemo(() => {
    if (globalSearchValue.length === 0) return props.rows;
    return props.rows.filter((row) => showRowFn(row, globalSearchValue));
  }, [props.rows, globalSearchValue, showRowFn]);

  // Pagination
  const [take, setTake] = React.useState<number>(defaultRowsPerPage);
  const [page, setPage] = React.useState<number>(0);
  const [visibleColumns] = React.useState<string[]>(columns.map((f) => f.key));

  // Selection
  const [checked, setChecked] = React.useState<string[]>([]);
  const allIds = React.useMemo(
    () => filteredRows.map((row: any) => getRowId(row)),
    [filteredRows, getRowId]
  );

  // Filters
  const isActiveFilter = React.useCallback(
    (column: RTableColumnProps, columnIndex: number) =>
      filters.isActive({ column, columnIndex }),
    [filters]
  );

  // Extended
  const [extended, setExtended] = React.useState<string[]>([]);

  // Sorting
  const [hoveredColumn, setHoveredColumn] = React.useState<string>('');
  const [orderBy, setOrderBy] = React.useState<
    { column: string; direction: Order; type: 'text' | 'number' | 'date' }[]
  >([]);

  const rows = React.useMemo(() => {
    let result = filteredRows;
    orderBy.forEach((order) => {
      result = stableSort(result, getComparator(order.direction, order.column));
    });
    return result;
  }, [filteredRows, orderBy]);

  const count = pagination?.count ?? rows.length;
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
              clearCheckedRows: () => setChecked([]),
            })}
        </div>
        <div style={{ width: '20%' }}>
          <input
            placeholder={toolbar?.search?.placeholder ?? 'Enter text'}
            className={toolbar?.search?.className ?? ''}
            type={'search'}
            onChange={(event) => setSearch(event.target.value)}
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
          {extend && (
            <div
              style={{
                flex: `0 0  auto`,
              }}
              className={extend?.className ?? ''}
              onClick={() => {
                if (extended.length === 0) setExtended(allIds);
                else setExtended([]);
              }}
            >
              {extended.length === 0 && <ArrowRightIcon />}
              {extended.length > 0 && <ArrowDownIcon />}
            </div>
          )}
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
            const { sorted = true, filtered = true } = column;
            const type = column.type ?? 'text';
            const flex = `${column.flex ?? 0} 0 ${column.width ?? '100px'}`;
            const sortItem = orderBy.find((f) => f.column === column.key);
            const isHovered =
              hoveredColumn === column.key && !sortItem?.direction;
            const isActiveColumnFilter = isActiveFilter(column, columnIndex);
            return (
              <div
                style={{
                  flex,
                  display: 'flex',
                  cursor: 'pointer',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={() => setHoveredColumn(column.key)}
                onMouseLeave={() => setHoveredColumn('')}
                key={`${column.key}_${columnIndex}`}
                className={`${column?.className ?? ''} ${
                  classNames?.column ?? ''
                }`}
                onClick={() => {
                  if (!sorted) return;
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: type === 'number' ? 'right' : 'left',
                  }}
                >
                  {column.render
                    ? column.render({
                        value: column.title ?? '',
                      })
                    : column.title}{' '}
                  {sorted && (sortItem?.direction === 'asc' || isHovered) && (
                    <ArrowUpIcon color={isHovered ? '#d1d5db' : '#18181b'} />
                  )}
                  {sortItem?.direction === 'desc' && (
                    <ArrowDownIcon color={isHovered ? '#d1d5db' : '#18181b'} />
                  )}
                </div>
                <div
                  style={{
                    width: 'min-content',
                  }}
                  onClick={() => {
                    filters?.onClick({
                      column,
                      columnIndex,
                    });
                  }}
                >
                  {filtered && (
                    <FilterIcon
                      color={isActiveColumnFilter ? '#dc2626' : '#18181b'}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={classNames?.body ?? ''}
        style={{
          overflowY: 'auto',
          height,
        }}
        ref={bodyScroll}
        onScroll={(scroll: React.UIEvent<HTMLDivElement>) => {
          if (headerScroll?.current)
            headerScroll.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }}
      >
        {rows.slice(page * take, page * take + take).map((row, rowIndex) => {
          const key = getRowId(row);
          const rowChecked = checked.includes(key);
          const renderExtendedRow = extend?.render({
            row,
            rowIndex,
            showRowFn,
            searchValue: globalSearchValue,
          });
          const isExtended = extended.includes(key);
          return (
            <React.Fragment key={key}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                className={classNames?.row ?? ''}
              >
                {extend && (
                  <div
                    style={{
                      flex: `0 0  auto`,
                    }}
                    className={extend?.className ?? ''}
                    onClick={() => {
                      if (extended.includes(key))
                        setExtended(extended.filter((f) => f !== key));
                      else setExtended([...extended, key]);
                    }}
                  >
                    {!isExtended && (
                      <ArrowRightIcon visible={!!renderExtendedRow} />
                    )}
                    {isExtended && (
                      <ArrowDownIcon visible={!!renderExtendedRow} />
                    )}
                  </div>
                )}
                {(selection?.visible || selection?.checkbox) && (
                  <div
                    style={{
                      flex: `0 0  auto`,
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
                    column.width ?? '100px'
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
              {isExtended && renderExtendedRow && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: bodyScroll.current?.scrollWidth ?? '100%',
                  }}
                  className={extend?.className ?? ''}
                >
                  {renderExtendedRow}
                </div>
              )}
            </React.Fragment>
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
            setPage(0);
            setTake(parseInt(event.target.value, 10));
          }}
        >
          {rowsPerPage?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>
          {take * page + 1} - {count < take ? count : take * page + take} {of}{' '}
          {count}
        </span>
        <div>
          <button
            disabled={page === 0}
            className={pagination?.previousPageClassName ?? ''}
            onClick={() => {
              if (page > 0) setPage((state) => state - 1);
            }}
          >
            {pagination?.previousPage ? (
              pagination?.previousPage
            ) : (
              <ChevronLeftIcon />
            )}
          </button>
        </div>
        <div>
          <button
            className={pagination?.nextPageClassName ?? ''}
            disabled={take * page + take >= count}
            onClick={() => setPage((state) => state + 1)}
          >
            {pagination.nextPage ? pagination.nextPage : <ChevronRightIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

import * as React from 'react';

export type RTableModel = { [name: string]: any };

export type RTableColumnProps = {
  key: NonNullable<string>;
  title?: string | number;
  visible?: boolean;
  width?: string | number;
  flex?: number;
  className?: string;
  hint?: string;
  type?: 'text' | 'number' | 'date';
  sorted?: boolean;
  filtered?: boolean;
  render?: (params: { value: string | number }) => React.ReactNode;
};

export type RTableProps = {
  rows: NonNullable<Array<RTableModel>>;
  columns: NonNullable<ReadonlyArray<RTableColumnProps>>;
  getRowId?: (row: RTableModel) => string | number;
  height: string | number;
  onSearchInputChanged?: (searchValue: string) => void;
  classNames?: {
    table?: string;
    column?: string;
    header?: string;
    body?: string;
    row?: string;
  };
  pagination?: {
    count?: number;
    page?: number;
    defaultRowsPerPage?: number;
    rowsPerPage?: number[];
    previousPage?: React.ReactNode;
    nextPage?: React.ReactNode;
    previousPageClassName?: string;
    nextPageClassName?: string;
    of?: string;
  };
  toolbar?: {
    className?: string;
    visible?: boolean;
    actions?: (params: {
      ids: string[];
      clearCheckedRows: () => void;
      visibleColumns: string[]
      setVisibleColumns: (columns:string[])=>void
    }) => React.ReactNode;
    search?: {
      placeholder?: string;
      className?: string;
    };
  };
  selection?: {
    visible?: boolean;
    checkbox?: string;
  };
  extend?: {
    className: string;
    render: (params: {
      row: RTableModel;
      rowIndex: number;
      showRowFn: (row: RTableModel, searchValue: string) => boolean;
      searchValue: string;
    }) => React.ReactNode;
  };
  filters: {
    onClick: (params: {
      column: RTableColumnProps;
      columnIndex: number;
    }) => void;
    isActive: (params: {
      column: RTableColumnProps;
      columnIndex: number;
    }) => boolean;
  };
};

export type Order = 'asc' | 'desc';

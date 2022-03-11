import * as React from 'react';

export type RTableModel = { [name: string]: any };

export type RTableColumnProps = {
  key: NonNullable<string>;
  title?: React.ReactNode;
  visible?: boolean;
  width?: string;
  flex?: number;
  className?: string;
  hint?: string;
  type?: 'text' | 'number' | 'date';
  sorted?: boolean;
};

export type RTableProps<> = {
  rows: NonNullable<Array<RTableModel>>;
  columns: NonNullable<ReadonlyArray<RTableColumnProps>>;
  getRowId?: (row: RTableModel) => string | number;
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
    actions?: (params: { ids: string[] }) => React.ReactNode;
    search?: {
      placeholder?: string;
      className?: string;
    };
  };
  selection?: {
    visible?: boolean;
    checkbox?: string;
  };
};

export type Order = 'asc' | 'desc';

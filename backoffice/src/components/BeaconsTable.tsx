import MaterialTable, {
  Column,
  Icons,
  MTableBodyRow,
  Query,
} from "@material-table/core";
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from "@mui/icons-material";
import { Chip, Link, Paper } from "@mui/material";
import {
  GetAllBeaconsFilters,
  GetAllBeaconsSort,
  IBeaconsGateway,
} from "gateways/beacons/IBeaconsGateway";
import React, { forwardRef, FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Placeholders } from "utils/writingStyle";
import { IBeaconSearchResultData } from "../entities/IBeaconSearchResult";
import { replaceNone } from "../lib/legacyData/replaceNone";
import { logToServer } from "../utils/logger";
import { TextFilter } from "./tableComponents/TextFilter";

interface IBeaconsTableProps {
  beaconsGateway: IBeaconsGateway;
}

export type BeaconRowData = Record<
  keyof Pick<
    IBeaconSearchResultData,
    | "hexId"
    | "ownerName"
    | "useActivities"
    | "id"
    | "lastModifiedDate"
    | "createdDate"
    | "beaconStatus"
    | "beaconType"
    | "cospasSarsatNumber"
    | "manufacturerSerialNumber"
  >,
  string
>;

const tableIcons: Icons<any> = {
  Add: forwardRef<SVGSVGElement, any>((props, ref) => (
    <AddBox {...props} ref={ref} />
  )),
  Check: forwardRef<SVGSVGElement, any>((props, ref) => (
    <Check {...props} ref={ref} />
  )),
  Clear: forwardRef<SVGSVGElement, any>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Delete: forwardRef<SVGSVGElement, any>((props, ref) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: forwardRef<SVGSVGElement, any>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef<SVGSVGElement, any>((props, ref) => (
    <Edit {...props} ref={ref} />
  )),
  Export: forwardRef<SVGSVGElement, any>((props, ref) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: forwardRef<SVGSVGElement, any>((props, ref) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: forwardRef<SVGSVGElement, any>((props, ref) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef<SVGSVGElement, any>((props, ref) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: forwardRef<SVGSVGElement, any>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: forwardRef<SVGSVGElement, any>((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef<SVGSVGElement, any>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Search: forwardRef<SVGSVGElement, any>((props, ref) => (
    <Search {...props} ref={ref} />
  )),
  SortArrow: forwardRef<SVGSVGElement, any>((props, ref) => (
    <ArrowDownward {...props} ref={ref} />
  )),
  ThirdStateCheck: forwardRef<SVGSVGElement, any>((props, ref) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: forwardRef<SVGSVGElement, any>((props, ref) => (
    <ViewColumn {...props} ref={ref} />
  )),
};

const columns: Column<BeaconRowData>[] = [
  {
    title: "Created date",
    field: "createdDate",
    filtering: false,
    defaultSort: "desc",
    type: "datetime",
    dateSetting: { format: "dd MM yyyy", locale: "en-GB" },
  },
  {
    title: "Last modified date",
    field: "lastModifiedDate",
    filtering: false,
    defaultSort: "desc",
    type: "datetime",
    dateSetting: { format: "dd MM yyyy", locale: "en-GB" },
  },
  {
    title: "Status",
    field: "beaconStatus",
    lookup: {
      NEW: "NEW",
      CHANGE: "CHANGE",
      MIGRATED: "MIGRATED",
      DELETED: "DELETED",
    },
    render: (rowData: BeaconRowData) => {
      if (rowData.beaconStatus === "MIGRATED") {
        return <Chip label={rowData.beaconStatus} color="secondary" />;
      } else if (rowData.beaconStatus === "CHANGE") {
        return <Chip label={rowData.beaconStatus} color="info" />;
      } else {
        return <Chip label={rowData.beaconStatus} color="primary" />;
      }
    },
  },
  {
    title: "Hex ID",
    field: "hexId",
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter hex id"
      />
    ),
    render: (rowData: BeaconRowData) => {
      if (rowData.beaconType === "LEGACY_BEACON") {
        return (
          <Link
            component={RouterLink}
            to={"/legacy-beacons/" + rowData.id}
            underline="hover"
          >
            {rowData.hexId ? rowData.hexId : <i>{Placeholders.NoData}</i>}
          </Link>
        );
      } else {
        return (
          <Link
            component={RouterLink}
            to={"/beacons/" + rowData.id}
            underline="hover"
          >
            {rowData.hexId ? rowData.hexId : <i>{Placeholders.NoData}</i>}
          </Link>
        );
      }
    },
  },
  {
    title: "Owner details",
    field: "ownerName",
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter owner name"
      />
    ),
    render: (rowData: BeaconRowData) => {
      return rowData.ownerName ? rowData.ownerName.toUpperCase() : "";
    },
  },
  {
    title: "Beacon use",
    field: "useActivities",
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter beacon uses"
      />
    ),
    render: (rowData: BeaconRowData) => {
      return rowData.useActivities ? rowData.useActivities.toUpperCase() : "";
    },
  },
  {
    title: "Manufacturer serial number",
    field: "manufacturerSerialNumber",
    render: (rowData: BeaconRowData) =>
      replaceNone(rowData.manufacturerSerialNumber),
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter manufacturer serial number"
      />
    ),
  },
  {
    title: "Cospas-Sarsat number",
    field: "cospasSarsatNumber",
    render: (rowData: BeaconRowData) => replaceNone(rowData.cospasSarsatNumber),
    filterComponent: ({ columnDef, onFilterChanged }) => (
      <TextFilter
        columnDef={columnDef}
        onFilterChanged={onFilterChanged}
        icons={tableIcons}
        filterTooltip="Filter cospas-sarsat number"
      />
    ),
  },
];

export const BeaconsTable: FunctionComponent<IBeaconsTableProps> = React.memo(
  function ({ beaconsGateway }): JSX.Element {
    return (
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        /*eslint no-async-promise-executor: "warn"*/
        data={(query) =>
          new Promise(async (resolve, _reject) => {
            try {
              const response = await beaconsGateway.getAllBeacons(
                ...buildTableQuery(query),
              );
              const beacons =
                response.content?.map(
                  (item: IBeaconSearchResultData): BeaconRowData => ({
                    createdDate: item.createdDate,
                    lastModifiedDate: item.lastModifiedDate,
                    beaconStatus: item.beaconStatus,
                    hexId: item.hexId,
                    ownerName: item.ownerName ?? "N/A",
                    useActivities: item.useActivities ?? "N/A",
                    id: item.id,
                    beaconType: item.beaconType,
                    cospasSarsatNumber: item.cospasSarsatNumber ?? "N/A",
                    manufacturerSerialNumber:
                      item.manufacturerSerialNumber ?? "N/A",
                  }),
                ) ?? [];
              resolve({
                data: beacons,
                page: response.number,
                totalCount: response.totalElements,
              });
            } catch (error) {
              logToServer.error(
                "Could not fetch beacons: " + JSON.stringify(error),
              );
              alert("Search timed out, please try refreshing in 30 seconds");
            }
          })
        }
        title=""
        options={{
          filtering: true,
          search: false,
          searchFieldVariant: "outlined",
          pageSize: 20,
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Row: (props) => (
            <MTableBodyRow {...props} data-testid="beacons-table-row" />
          ),
        }}
      />
    );
  },
);

function buildTableQuery(
  query: Query<BeaconRowData>,
): Parameters<IBeaconsGateway["getAllBeacons"]> {
  const term = query.search;

  // typeof filters could be wider than GetAllBeaconsFilter but that's ok here
  // This is necessary due to weaker type definitions from @material-table/core
  const filters: Partial<Record<keyof BeaconRowData, string>> = {};
  query.filters.forEach((filter) => {
    if (filter.column.field) {
      filters[filter.column.field as keyof BeaconRowData] = filter.value;
    }
  });

  let sort: GetAllBeaconsSort = null;
  if (query.orderBy && query.orderBy.field && query.orderDirection) {
    sort = [query.orderBy.field as keyof BeaconRowData, query.orderDirection];
  }

  return [
    term,
    filters as GetAllBeaconsFilters,
    query.page,
    query.pageSize,
    sort,
  ];
}

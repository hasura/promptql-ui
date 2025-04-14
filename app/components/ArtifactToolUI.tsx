import { makeAssistantToolUI } from "@assistant-ui/react";
import {
  ChevronUpIcon,
  DatabaseIcon,
  SearchIcon,
  Maximize2Icon,
  XIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  flexRender,
  type HeaderGroup,
  type Row,
  type Cell,
} from "@tanstack/react-table";
import { Dialog } from "@headlessui/react";

interface ArtifactDisplayArgs {
  artifact: {
    identifier: string;
    title: string;
    artifact_type: string;
    data: unknown[];
  };
}

const ArtifactDisplay = ({
  args: rawArgs,
}: {
  args: ArtifactDisplayArgs | string;
}) => {
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const args = typeof rawArgs === "string" ? JSON.parse(rawArgs).args : rawArgs;

  const columns = useMemo(() => {
    if (!args?.artifact?.data?.length) return [];
    return Object.keys(args.artifact.data[0] as object).map((key) => ({
      accessorKey: key,
      header: key,
      cell: ({ getValue }: { getValue: () => unknown }) => String(getValue()),
    })) as ColumnDef<Record<string, unknown>>[];
  }, [args?.artifact?.data]);

  const table = useReactTable({
    data: (args?.artifact?.data as Record<string, unknown>[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (!args?.artifact) return null;

  const { title, artifact_type } = args.artifact;

  const renderTableData = (data: unknown[]) => {
    if (!data.length) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="w-full rounded-md border border-[#ffc72c] pl-10 pr-4 py-2 text-sm focus:border-[#da291c] focus:outline-none focus:ring-1 "
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <span>•</span>
            <span>{table.getFilteredRowModel().rows.length} rows</span>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto min-h-[60vh] max-h-[70vh]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                {table
                  .getHeaderGroups()
                  .map((headerGroup: HeaderGroup<Record<string, unknown>>) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </th>
                      ))}
                    </tr>
                  ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table
                  .getRowModel()
                  .rows.map((row: Row<Record<string, unknown>>) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row
                        .getVisibleCells()
                        .map((cell: Cell<Record<string, unknown>, unknown>) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm rounded-md border border-[#ffc72c] text-[#27251f] disabled:opacity-50 disabled:cursor-not-allowed  transition-colors"
            >
              First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm rounded-md border border-[#ffc72c] text-[#27251f] disabled:opacity-50 disabled:cursor-not-allowed  transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm rounded-md border border-[#ffc72c] text-[#27251f] disabled:opacity-50 disabled:cursor-not-allowed  transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm rounded-md border border-[#ffc72c] text-[#27251f] disabled:opacity-50 disabled:cursor-not-allowed  transition-colors"
            >
              Last
            </button>
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="px-3 py-1 text-sm rounded-md border border-[#ffc72c] focus:border-[#da291c] focus:outline-none focus:ring-1 "
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <DatabaseIcon className="size-4" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <button
          onClick={() => setIsFullscreen(false)}
          className="rounded-md p-1 hover:bg-gray-100"
        >
          <XIcon className="size-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 min-h-[300px]">
        {artifact_type === "table" ? (
          renderTableData(args.artifact.data)
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-gray-600">
            {JSON.stringify(args.artifact.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-4 w-full rounded-lg border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 bg-gray-50/50">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            <DatabaseIcon className="size-4" />
            <span className="text-sm">{title}</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="rounded-md p-1 hover:bg-gray-100"
            >
              <Maximize2Icon className="size-4" />
            </button>
            <ChevronUpIcon
              className="size-4 transition-transform duration-200"
              style={{
                transform: open ? "rotate(180deg)" : "none",
              }}
            />
          </div>
        </div>
        {open && (
          <div className="border-t px-4 py-3">
            {artifact_type === "table" ? (
              renderTableData(args.artifact.data)
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-600">
                {JSON.stringify(args.artifact.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-[95vw] h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden">
            {renderContent()}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export const ArtifactToolUI = makeAssistantToolUI<ArtifactDisplayArgs, void>({
  toolName: "artifact_display",
  render: ArtifactDisplay,
});

import { makeAssistantToolUI } from "@assistant-ui/react";
import { ChevronUpIcon, DatabaseIcon } from "lucide-react";
import { useState } from "react";

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
  const args = typeof rawArgs === "string" ? JSON.parse(rawArgs).args : rawArgs;

  if (!args?.artifact) return null;

  const { title, data, artifact_type } = args.artifact;

  const renderTableData = (data: unknown[]) => {
    if (!data.length) return null;

    const headers = Object.keys(data[0] as object);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx}>
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {String((row as Record<string, unknown>)[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mb-4 w-full rounded-lg border shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 bg-gray-50/50"
      >
        <div className="flex items-center gap-2">
          <DatabaseIcon className="size-4" />
          <span className="text-sm">{title}</span>
        </div>
        <ChevronUpIcon
          className="size-4 transition-transform duration-200"
          style={{
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>
      {open && (
        <div className="border-t px-4 py-3">
          {artifact_type === "table" ? (
            renderTableData(data)
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-600">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export const ArtifactToolUI = makeAssistantToolUI<ArtifactDisplayArgs, void>({
  toolName: "artifact_display",
  render: ArtifactDisplay,
});

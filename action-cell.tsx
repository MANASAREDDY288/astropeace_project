import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Edit } from "lucide-react";
import { Switch } from "@heroui/react";

import { ScreenAccess } from "@/utils/services/app.event";
import { t } from "@/i18n";

interface ActionCellRendererProps extends ICellRendererParams<any> {
  onAction: (data: any, action: "edit" | "status") => void;
}

const ActionCellRenderer: React.FC<ActionCellRendererProps> = ({
  data,
  onAction,
}) => {
  const handleEdit = () => {
    if (data) {
      onAction(data, "edit");
    }
  };

  const handleToggleActive = () => {
    if (data) {
      const config = confirm(t("CONFIRM_ACTION"));

      if (config) {
        onAction(data, "status");
      }
    }
  };

  return (
    data && (
      <>
        <div className="flex flex-row items-center gap-2 p-2">
          <div className="w-8 h-8">
            <Edit
              className="cursor-pointer text-blue-500"
              size={24}
              onClick={handleEdit}
            />
          </div>
          <div>
            <Switch
              isDisabled={!ScreenAccess.value.delete}
              isSelected={data?.active || data?.isActive}
              size="sm"
              onValueChange={handleToggleActive}
            />
          </div>
        </div>
      </>
    )
  );
};

export default ActionCellRenderer;

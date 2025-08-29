import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import { CalendarCheck2 } from "lucide-react";

interface BookingCellRendererProps extends ICellRendererParams<any> {
  onAction: (data: any, action: "booking") => void;
}

const BookingCellRenderer: React.FC<BookingCellRendererProps> = ({
  data,
  onAction,
}) => {
  // Only render icon after real data comes from API
  if (!data) {
    return null;
  }

  const handleBooking = () => {
    onAction(data, "booking");
  };

  return (
    <div className="flex flex-row items-center gap-4 p-4">
      <CalendarCheck2
        className="cursor-pointer hover:text-blue-500"
        size={20}
        onClick={handleBooking}
      />
    </div>
  );
};

export default BookingCellRenderer;

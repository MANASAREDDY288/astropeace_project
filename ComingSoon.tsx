import { Card } from "@heroui/react";

import ComingSoonComponent from "@/components/ComingSoonComponent";

const ComingSoonScreen = () => {
  return (
    <>
      <div className="h-full">
        <Card className="mx-auto w-full h-[calc(100vh-86px)]">
          <ComingSoonComponent />
        </Card>
      </div>
    </>
  );
};

export default ComingSoonScreen;

import AddService from '@/components/services/AddService';
import ServiceTable from '@/components/services/ServiceTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Service = () => {
  return (
    <div className='mt-8'>
      <Tabs defaultValue='servicelist'>
        <TabsList>
          <TabsTrigger value='servicelist'>List</TabsTrigger>
          <TabsTrigger value='addservice'>Add Service</TabsTrigger>
        </TabsList>
        <TabsContent value='servicelist'>
          <ServiceTable />
        </TabsContent>
        <TabsContent value='addservice'>
          <AddService />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Service;

import Receipt from '@/pages/Receipt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Service from '@/pages/Service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <div className='container mx-auto mt-7 shadow-xl p-8 rounded-md'>
        <Tabs defaultValue='receipt'>
          <TabsList>
            <TabsTrigger value='services'>Services</TabsTrigger>
            <TabsTrigger value='receipt'>Receipt</TabsTrigger>
          </TabsList>
          <TabsContent value='receipt'>
            <Receipt />
          </TabsContent>
          <TabsContent value='services'>
            <Service />
          </TabsContent>
        </Tabs>
      </div>
      <ToastContainer position='top-right' />
    </>
  );
}

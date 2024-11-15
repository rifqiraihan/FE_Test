import React from 'react';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Skeleton } from '@mui/material'
import moment from 'moment';
import { Moment } from 'moment';
import { enqueueSnackbar } from 'notistack';
import { getLalins } from '../../api/lalinApi';
import { ILalin } from '../../interfaces/lalin';
import { LoadingButton } from '@mui/lab';
import { PieChart, Pie, Cell, Tooltip, Label, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, } from 'recharts';

const Dashboard = () => {
  const [data, setData] = React.useState<ILalin[]>([]);
  const [date, setDate] = React.useState<Moment | null>(moment('2023-11-01'));
  const [loading, setLoading] = React.useState<boolean>(true);
  

  const [paymentMethodData, setPaymentMethodData] = React.useState({
    BCA: 0,
    BRI: 0,
    BNI: 0,
    DKI: 0,
    Mandiri: 0,
    Mega: 0,
    Flo: 0,
    KTP: 0,
  });

  const [paymentMethodDataBar, setPaymentMethodDataBar] = React.useState<{
    [key: string]: number;
  }>({
    BCA: 0,
    BRI: 0,
    BNI: 0,
    DKI: 0,
    Mandiri: 0,
    Mega: 0,
    Flo: 0,
    KTP: 0
  });

  const fetchLalins = async () => {
    try {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const response = await getLalins(formattedDate);
      setData(response.data.rows.rows);
    } catch (err) {
      enqueueSnackbar('Failed to Fetch Lalins', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchLalins()
  };


  const calculatePaymentMethodData = (filteredData: ILalin[]) => {
    const paymentMethods = {
      BCA: 0,
      BRI: 0,
      BNI: 0,
      DKI: 0,
      Mandiri: 0,
      Mega: 0,
      Flo: 0,
      KTP: 0,
    };

    filteredData.forEach(item => {
      paymentMethods.BCA += item.eBca;
      paymentMethods.BRI += item.eBri;
      paymentMethods.BNI += item.eBni;
      paymentMethods.DKI += item.eDKI;
      paymentMethods.Mandiri += item.eMandiri;
      paymentMethods.Mega += item.eMega;
      paymentMethods.Flo += item.eFlo;
      if (item.DinasOpr > 0 || item.DinasMitra > 0 || item.DinasKary > 0) {
        paymentMethods.KTP += 1;
      }
    });

    return paymentMethods;
  };

  const calculateGateData = (filteredData: ILalin[]) => {
    const gateData: { [key: number]: number } = {};
  
    filteredData.forEach(item => {
      if (!gateData[item.IdGerbang]) {
        gateData[item.IdGerbang] = 0;
      }
      gateData[item.IdGerbang] += 1;
    });
  
    return gateData;
  };

  const calculateShiftData = (filteredData: ILalin[]) => {
    const shiftData = {
      Shift1: 0,
      Shift2: 0,
      Shift3: 0,
    };

    filteredData.forEach(item => {
      if (item.Shift === 1) {
        shiftData.Shift1 += 1;
      } else if (item.Shift === 2) {
        shiftData.Shift2 += 1;
      } else if (item.Shift === 3) {
        shiftData.Shift3 += 1;
      }
    });

    return shiftData;
  };


  const calculateBranchData = (filteredData: ILalin[]) => {
    const branchData: { [key: string]: number } = {}; 
  
    filteredData.forEach(item => {
      if (!branchData[item.IdCabang]) {
        branchData[item.IdCabang] = 0;
      }
      branchData[item.IdCabang] += 1;
    });
  
    return branchData;
  };


    const filteredData = data;
    const updatedPaymentMethodData = calculatePaymentMethodData(filteredData);
    const gateData = calculateGateData(filteredData);
    const shiftData: Record<string, number> = calculateShiftData(filteredData);
    const branchData = calculateBranchData(filteredData);


  const gateChartData = Object.keys(gateData).map((key) => ({
    gate: `Gate ${parseInt(key)}`,
    count: gateData[parseInt(key)],
  }));

  const updatedPaymentMethodDataBar = calculatePaymentMethodData(data);
  const paymentMethodChartData = Object.keys(paymentMethodData).map(key => ({
    name: key,
    value: paymentMethodDataBar[key],
  }));

  const shiftDistributionData = [
    { name: 'Shift 1', value: shiftData.Shift1 },
    { name: 'Shift 2', value: shiftData.Shift2 },
    { name: 'Shift 3', value: shiftData.Shift3 },
  ];

  const branchDistributionData = Object.keys(branchData).map((branch) => ({
    name: `Ruas ${branch}`,
    value: branchData[branch],
  }));

  const shiftChartColors = ['#FF6384', '#36A2EB', '#FFCE56'];
  const branchChartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'];

  React.useEffect(() => {
    setPaymentMethodData(updatedPaymentMethodData);
    setPaymentMethodDataBar(updatedPaymentMethodDataBar);
  }, [data]);

  React.useEffect(() => {
    fetchLalins();

    const token = localStorage.getItem('token');
    if (!token) {
      enqueueSnackbar('Please Login First', { variant: 'error' });
      window.location.href = '/login';
    }
  }, []);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-10">Dashboard</h1>
      <div className=" mb-8 w-full md:w-1/2">
       
        <div className="w-full flex gap-2 items-center">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </LocalizationProvider>
          <LoadingButton 
              loading={loading}
               variant="contained"
               className="!p-3 !rounded-full hover:!bg-blue-500"
               style={{backgroundColor:'rgb(25, 118, 210)', minWidth:'120px'}}
                onClick={handleFilter}>
                Filter
            </LoadingButton>
        </div>
       
      </div>

      <div style={{marginTop:'100px'}}>
        {data.length > 0 ? (
        <div className="">
          {loading ? (
            <div>
              <div className='flex flex-row gap-4'>
                <Skeleton variant='rectangular' className='w-full h-48'/>
                <Skeleton variant='rectangular' className='w-full h-48'/>
              </div>
              <div className='flex flex-row gap-4'>
                <Skeleton variant='rectangular' className='w-full h-48'/>
                <Skeleton variant='rectangular' className='w-full h-48'/>
              </div>
            </div>
          ) : (
          <div>
          <div className='flex flex-col md:flex-row gap-8 items-center mb-12'>
            <div className='w-full'>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentMethodChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis>
                    <Label value="Jumlah Lalin" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                  </YAxis>
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col items-center w-full">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={shiftDistributionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {shiftDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={shiftChartColors[index % shiftChartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center">
                <h2 className="text-lg font-semibold">Shift Distribution</h2>
                <ul className="text-gray-600">
                  {shiftDistributionData.map((entry, index) => (
                    <li key={index} className="flex justify-between">
                      <span
                        className="text-gray-400"
                        style={{
                          color: shiftChartColors[index % shiftChartColors.length], // Use the same color as the chart
                        }}
                      >
                        ●
                      </span>
                      {entry.name} <span>{shiftData[entry.name]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-8 items-center' style={{marginTop:'100px'}}>
          <div className='w-full'>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gateChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gate"/>
                  <YAxis>
                    <Label value="Jumlah Lalin" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                  </YAxis>
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
          </div>
          <div className="flex flex-col items-center w-full">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={branchDistributionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // Display percentage in the label
                >
                  {branchDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={branchChartColors[index % branchChartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
              <div className="text-center">
                <h2 className="text-lg font-semibold">Branch Distribution</h2>
                <ul className="text-gray-600">
                  {Object.keys(branchData).map((branch, index) => (
                    <li key={index} className="flex justify-between">
                      <span
                        className="text-gray-400"
                        style={{
                          color: branchChartColors[index % branchChartColors.length], // Dynamically set color
                        }}
                      >
                        ●
                      </span>
                      Ruas {branch} <span>{branchData[branch]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        )}
        </div>
        ):(
          <div className='justify-center flex align-center' style={{marginTop:'50px'}}>
           No Data Available at {moment(date).format('MMM, DD YYYY')}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;

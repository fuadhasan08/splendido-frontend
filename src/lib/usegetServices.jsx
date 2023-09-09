import React, { useEffect, useState } from 'react';
import axios from 'axios';

const usegetServices = () => {
  const [serviceList, setServices] = useState([]);

  return serviceList;
};

export default usegetServices;

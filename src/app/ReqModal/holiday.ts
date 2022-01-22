interface Holiday {
    name: string;
    description: string;
    businessUnit: string;
    date: string;
  }
  
  const inits: Holiday = {
    name: '',
    description: '',
    businessUnit: '',
    date: '',
  };
  
  export { Holiday, inits };
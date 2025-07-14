// Update the opening line of PropertyProfile component
const PropertyProfile = ({ propertyId }) => {
  const navigate = useNavigate();
  const { properties, updateProperty } = useData();
  const [property, setProperty] = useState(null);
  
  // Update the useEffect to use propertyId prop instead of id from useParams
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // First get basic property data from context
        const parsedId = parseInt(propertyId);
        const foundProperty = properties.find(p => p.id === parsedId);
        
        if (!foundProperty) {
          setError('Property not found');
          setLoading(false);
          return;
        }
        
        // Rest of the fetch property logic...
      } catch (error) {
        console.error('Error in fetchProperty:', error);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId, properties]);
  
  // Rest of the component implementation remains the same...
};

export default PropertyProfile;
'use client'
import {Box, Stack, Typography,Modal, TextField, Button, Table,TableBody, TableHead, TableRow, TableCell }from '@mui/material'
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {collection, doc, getDoc, setDoc, getDocs, deleteDoc, query} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
        const snapshot = query(collection(firestore,'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc) => {
            inventoryList.push({name: doc.id,...doc.data(), })
        })
        setInventory(inventoryList)
        console.log(inventoryList)
      }
  
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
          const {quantity} = docSnap.data()
          await setDoc(docRef, {quantity: quantity + 1})
    }else{
          await setDoc(docRef, {quantity: 1})
    }
    
        await updateInventory()
   }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        const {quantity} = docSnap.data()
        if (quantity === 1){
          await deleteDoc(docRef)
        }
        else{
          await setDoc(docRef, {quantity: quantity - 1})
        }
    }
    await updateInventory()
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
     updateInventory(); 
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width ='100vw' height ='46vw' display='flex' flexDirection='column' justifyContent='center' alignItems='center' gap={4}
    style={{
      backgroundImage: 'url(/OffBackground.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Box width='100%' bgcolor='#F5DEB3' p={2} display='flex' justifyContent='Center'
      position="fixed" top={0} left={0} zIndex={1}>
        <Typography variant='h4' color='#333'>Inventory Management App</Typography>
      </Box>
      
      <Modal open={open} onClose={handleClose}>
          <Box position ='absolute' top='50%' left='50%'  width ={400} bgcolor='white' 
          border ='2px solid #000' boxShadow={24} p={2} display='flex' flexDirection='column' 
          gap={3} sx={{transform:'translate(-50%,-50%)',}} >
                <Typography variant ='h6'>Add Item</Typography>
                <Stack width='100%' direction='row' spacing={2} alignItems="center">
                    <TextField variant='outlined' fullWidth value={itemName} onChange={(e)=>{
                      setItemName(e.target.value)
                    }}
                    />
                    <Button variant='outlined' onClick ={() => {
                      addItem(itemName) 
                      setItemName('')
                      handleClose()}}>
                      Add
                    </Button>  
                </Stack> 
          </Box>
      </Modal>

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField variant='outlined' 
        placeholder='Search items' value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 2 }}
        />
        <Button variant='contained' onClick={() => { handleOpen() }}> Add New item</Button>
      </Stack>
      
      <Box border='1px solid #333' width='750px' height='300px' display='flex' flexDirection='column' overflow='auto'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '33%', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Item Name</TableCell>
              <TableCell sx={{ width: '33%', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Quantity</TableCell>
              <TableCell sx={{ width: '33%', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              filteredInventory.length > 0 ? (
                filteredInventory.map(({name, quantity}) => (
                  <TableRow key={name} sx={{ border: '1px solid #ccc' }}>
                    <TableCell sx={{ width: '33%', fontSize: 16, textAlign: 'center' }}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </TableCell>
                    <TableCell sx={{ width: '33%', fontSize: 16, textAlign: 'center' }}>
                      {quantity}
                    </TableCell>
                    <TableCell sx={{ width: '33%', fontSize: 16, textAlign: 'center' }}>
                      <Stack direction='row' spacing={2} justifyContent='center'>
                        <Button variant='contained' sx={{ width: 100 }} onClick={() => { addItem(name) }}>
                          Add
                        </Button>
                        <Button variant='contained' sx={{ width: 100 }} onClick={() => { removeItem(name) }}>
                          Remove
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', fontSize: 16 }}>
                    No items found. Please add items.
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </Box>

    </Box>
  )
}

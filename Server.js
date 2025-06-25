const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
require('dotenv').config();
const PORT = process.env.PORT || 5000;



const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
  


const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});



const Expense = mongoose.model('Expense', expenseSchema);

// const MONGO_URI = "mongodb+srv://vigneshkumar:Kumar%402002@cluster0.1npwyyr.mongodb.net/expenseTracker?retryWrites=true&w=majority&appName=Cluster0";
  


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

app.post('/expense', async (req, res) => {
  try {
    const { title, amount } = req.body;
    const expense = new Expense({title,amount });
    await expense.save();
    res.status(201).json(expense);
  }
    catch (error) {
        console.error('Error saving expense:', error);
        res.status(500).json({ error: 'Failed to save expense' });
    }
}
);


app.get('/expense', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});
//=

app.delete('/expense/:userID' , async(req ,res)=>{
try {
    const{ userID }=req.params;
  const deleteExpense = await Expense.findByIdAndDelete(userID);
  if(!deleteExpense){
    return res.status(404).json({error :"not found"});
  }
  res.status(201).json({message:"expanse deleted",deleteExpense })    
  
} catch (error) {
  console.error('error deleteing expense', error)
  res.status(500).json({error:'failed to delete '})
}
})


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
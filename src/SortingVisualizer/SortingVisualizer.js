import React from 'react'
import './SortingVisualizer.css'
import InsertionSort from '../SortingAlgorithms/InsertionSort'
import SelectionSort from '../SortingAlgorithms/SelectionSort'
import BubbleSort from '../SortingAlgorithms/BubbleSort'
import GetQuickSortAnimation from '../SortingAlgorithms/QuickSort'


const NORMAL_COLOR = '#900c3f';
const CHANGED_COLOR = '#FFFF00';
const AFTER_CHANGE_COLOR = '#90EE90';

var abort = false;

export default class SortingVisualizer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            arrayToSort: [],
            prevChanged: [],
            numberOfItems: 20,
            delay: 3,
            SortingInProcess: false,
            Sorted: false
        };
    }

    componentDidMount(){
        this.resetArray();
    }


    //logic to reset the array 

    resetArray(){
        const arrayToSort = [];
        const prevChanged = [];
        for (let i = 0; i < this.state.numberOfItems; i++) {
            arrayToSort.push(this.RandomIntBetweenRange(5, 1000));
        }
        this.setState({ arrayToSort, prevChanged });
        abort = false;
    }
    
    generateNewArray(){
        abort = true;
        this.setState({ sortingInProgress: false });
        this.setState({Sorted : false});
        this.resetArray();
    }

    async SortArray(algo){
        if(this.state.Sorted){
            return;
        }
        this.setState({ sortingInProgress: true });
        let sortedArrayAnim = algo(this.state.arrayToSort);
        let arrayToSort = this.state.arrayToSort;
        let prevChanged = this.state.prevChanged;

        for (let index = 0; index < sortedArrayAnim.length; index++) {
            if(this.abort){
                console.log(abort);
                return null;
            }
            const [i,j] = sortedArrayAnim[index];

            //swap 
            let temp = arrayToSort[i];
            arrayToSort[i] = arrayToSort[j];
            arrayToSort[j] = temp;

            //append to list
            prevChanged.push(i,j);

            if(index === sortedArrayAnim.length - 1){
                prevChanged.push(arrayToSort.length + 1, arrayToSort.length + 1);
                this.setState({prevChanged});
            }
            this.setState({ sortingInProgress: false });
            this.setState({Sorted : true});
            this.setState({ arrayToSort,prevChanged });
            await sleep(this.state.delay);
        }
    }

    async selectionSort(){
        if(this.state.Sorted){
            return;
        }
        this.setState({ sortingInProgress: true });
        let sortedArrayAnim = SelectionSort(this.state.arrayToSort);
        let arrayToSort = this.state.arrayToSort;
        let prevChanged = this.state.prevChanged;

        //loop through all the animations
        for (let index = 0; index < sortedArrayAnim.length; index++) {
            const [i,j, swap] = sortedArrayAnim[index];

            //change array
            if(swap){
                let temp = arrayToSort[i];
                arrayToSort[i] = arrayToSort[j];
                arrayToSort[j] = temp;
            }
        
            prevChanged.push(i,j);

            if(index === sortedArrayAnim.length - 1){
                prevChanged.push(arrayToSort.length + 1, arrayToSort.length + 1);
                this.setState({prevChanged});
            }


            this.setState({ sortingInProgress: false });
            this.setState({Sorted : true});
            this.setState({ arrayToSort, prevChanged });
                
            await sleep(this.state.delay);
        }
    }

    handleItemsInputOnChange(event){
        event.persist();
        this.setState({numberOfItems : event.target.value}, () => {
            this.resetArray();
            console.log(event.target.value + " - " + this.state.numberOfItems + " - arraySize: " + this.state.arrayToSort.length);
        });
        
    }

    handleDelayInputOnChange(event){
        this.setState({delay : event.target.value});
        
    }

    getColor(index){

        let prevChanged = this.state.prevChanged;

        if(prevChanged.includes(index)){
            if(index === prevChanged[prevChanged.length - 1] || index === prevChanged[prevChanged.length - 2]){
                return CHANGED_COLOR;
            }
            else{
                return AFTER_CHANGE_COLOR;
            }
        }
        else{
            return NORMAL_COLOR;
        }
        
    }



    render() {
        const {arrayToSort} = this.state;
        let widthValue = 40 / this.state.numberOfItems;
        return (

            <div className="main-div" id="centerdiv">
                <div className="centerdivKeepWidth" id="itemsDiv">
                    {arrayToSort.map((heightValue, idx) => (
                        <div className="array-item" key={idx} style={{height: `${heightValue / 25}vw`, width: `${widthValue}vw`, backgroundColor: this.getColor(idx)}}>
                            
                        </div>
                    ))}
                </div>
                <div className="centerdivKeepWidth" id="buttonsDiv">
                    <button onClick={() => this.generateNewArray()} disabled={this.state.sortingInProgress}>Generate new array</button>
                    <button onClick={() =>{
                        this.SortArray(BubbleSort)
                        this.displayBubbleSort()
                        }} disabled={this.state.sortingInProgress}>Bubble Sort</button>
                    <button onClick={() => this.SortArray(InsertionSort)} disabled={this.state.sortingInProgress}>Insertion Sort</button>
                    <button onClick={() => this.selectionSort()} disabled={this.state.sortingInProgress}>Selection Sort</button>
                    <button onClick={() => this.SortArray(GetQuickSortAnimation)} disabled={this.state.sortingInProgress}> QuickSort</button>
                </div>
                <div className="flexDiv">
                    <div className="centerdivKeepWidth">
                        <label className="numberLabel">Number of Items: </label>
                        <input className="numberInput" type="range" min="20" max="200" step = "1" onChange={(event) => this.handleItemsInputOnChange(event)} defaultValue={this.state.numberOfItems}/>
                    </div>
                    <div className="centerdivKeepWidth">
                        <label className="numberLabel">Delay: </label>
                        <input className="numberInput" type="range" min="1" max="100" onChange={(event) => this.handleDelayInputOnChange(event)} defaultValue={this.state.delay}/>
                    </div>
                </div>
            </ div>

        );
    }

    RandomIntBetweenRange(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
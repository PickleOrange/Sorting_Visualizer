export default function BubbleSort(array){
    //shallow copy of the array for modification purposes
    let arr = array.slice(0);
    //for keeping track of the animations 
    let animations = []
    //bubble sort that stops when there are no more elements to sort
    while(true){
        let hasChanged = false;
        for (let i = 0; i < arr.length - 1; i++) {
            if(arr[i] > arr[i + 1]){
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                animations.push([i, i + 1]);
                hasChanged = true;
            }
            
        }
        if(!hasChanged)
            break;
    }
    return animations;
}
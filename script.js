let speed = 50;
document.getElementById('speed').addEventListener('input', (e) => {
    speed = 101 - e.target.value; 
    document.getElementById('speed-value').innerText = e.target.value;
});
// Sleep function to slow down the sorting for visualization
function sleep() {
    return new Promise(resolve => setTimeout(resolve, speed));
}
async function swap(el1, el2) {
    el1.classList.add('active'); 
    el2.classList.add('active');
    
    await sleep(); // Pause to visualize the swap

    // Swap the heights
    let temp = el1.style.height;
    el1.style.height = el2.style.height;
    el2.style.height = temp;

    await sleep(); // Pause after swapping

    // Remove the highlight
    el1.classList.remove('active');
    el2.classList.remove('active');
}

// Bubble Sort
async function bubbleSort(arrayBars) {
    for (let i = 0; i < arrayBars.length; i++) {
        for (let j = 0; j < arrayBars.length - i - 1; j++) {
            if (parseInt(arrayBars[j].style.height) > parseInt(arrayBars[j + 1].style.height)) {
                await swap(arrayBars[j], arrayBars[j + 1]);
            }
        }
    }
}

// Selection Sort
async function selectionSort(arrayBars) {
    for (let i = 0; i < arrayBars.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arrayBars.length; j++) {
            if (parseInt(arrayBars[j].style.height) < parseInt(arrayBars[minIndex].style.height)) {
                minIndex = j;
            }
        }
        if (minIndex !== i) await swap(arrayBars[i], arrayBars[minIndex]);
    }
}

// Insertion Sort
async function insertionSort(arrayBars) {
    for (let i = 1; i < arrayBars.length; i++) {
        let key = arrayBars[i].style.height;
        let j = i - 1;
        while (j >= 0 && parseInt(arrayBars[j].style.height) > parseInt(key)) {
            await swap(arrayBars[j + 1], arrayBars[j]);
            j--;
        }
        arrayBars[j + 1].style.height = key;
    }
}

// Merge Sort Helper
async function merge(arrayBars, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = [], R = [];

    for (let i = 0; i < n1; i++) L.push(arrayBars[l + i].style.height);
    for (let i = 0; i < n2; i++) R.push(arrayBars[m + 1 + i].style.height);

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (parseInt(L[i]) <= parseInt(R[j])) {
            arrayBars[k].style.height = L[i];
            i++;
        } else {
            arrayBars[k].style.height = R[j];
            j++;
        }
        await sleep(); // Pause to visualize merging
        k++;
    }
    while (i < n1) {
        arrayBars[k].style.height = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arrayBars[k].style.height = R[j];
        j++;
        k++;
    }
}

// Merge Sort
async function mergeSort(arrayBars, l = 0, r = arrayBars.length - 1) {
    if (l >= r) return;
    let m = Math.floor((l + r) / 2);
    await mergeSort(arrayBars, l, m);
    await mergeSort(arrayBars, m + 1, r);
    await merge(arrayBars, l, m, r);
}

// Partition function for Quick Sort
async function partition(arrayBars, low, high) {
    let pivot = parseInt(arrayBars[high].style.height);
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (parseInt(arrayBars[j].style.height) < pivot) {
            i++;
            await swap(arrayBars[i], arrayBars[j]);
        }
    }
    await swap(arrayBars[i + 1], arrayBars[high]);
    return i + 1;
}

// Quick Sort
async function quickSort(arrayBars, low = 0, high = arrayBars.length - 1) {
    if (low < high) {
        let pi = await partition(arrayBars, low, high);
        await quickSort(arrayBars, low, pi - 1);
        await quickSort(arrayBars, pi + 1, high);
    }
}

// Sorting based on user choice
async function performSort(arrayBars, algorithm) {
    switch (algorithm) {
        case 'bubble':
            await bubbleSort(arrayBars);
            break;
        case 'selection':
            await selectionSort(arrayBars);
            break;
        case 'insertion':
            await insertionSort(arrayBars);
            break;
        case 'merge':
            await mergeSort(arrayBars);
            break;
        case 'quick':
            await quickSort(arrayBars);
            break;
    }
}

// Generate array bars
function generateArray(size) {
    let array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 300) + 20);
    }
    return array;
}

// Display array bars in container
function displayArray(array) {
    const arrayContainer = document.getElementById('array-container');
    arrayContainer.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${array[i]}px`;
        arrayContainer.appendChild(bar);
    }
}

// Event listeners for sorting
document.getElementById('generate-array').addEventListener('click', () => {
    const newArray = generateArray(50); // Adjust size as needed
    displayArray(newArray);
});

document.getElementById('sort').addEventListener('click', async () => {
    const algorithm = document.getElementById('algorithm').value;
    const arrayBars = document.querySelectorAll('.array-bar');
    await performSort(arrayBars, algorithm);
});

// Initial generation of array
document.getElementById('generate-array').click();

#include <iostream>
#include <chrono>
#include <random>
#include <math.h>
#include "Sort.h"

/*
template<typename T>
void Sort(Sequence<T>& arr, ISorter<T>*&& sort = new BubbleSort<T>{})
{
    (*sort)(arr);
    delete sort;
}

template<typename T>
void Sort(Sequence<T>& arr, const ISorter<T>*& sort = new BubbleSort<T>{})
{
    (*sort)(arr);
}
*/

template<typename T>
void Sort(Sequence<T>& arr, ISorter<T>* sort = new BubbleSort<T>{})
{
    (*sort)(arr);
}

// random Numeric
template<typename Numeric, typename Generator = std::mt19937>
Numeric random(Numeric from, Numeric to)
{
    thread_local static Generator gen(std::random_device{}());

    using dist_type = typename std::conditional
        <
        std::is_integral<Numeric>::value
        , std::uniform_int_distribution<Numeric>
        , std::uniform_real_distribution<Numeric>
        >::type;

    thread_local static dist_type dist;

    return dist(gen, typename dist_type::param_type{ from, to });
}

// random seq of Numeric
template<typename T, typename Numeric>
void randomSequence(Sequence<T>& arr, Numeric from, Numeric to)
{
    for (size_t i = 0; i < arr.GetLength(); i++) {
        arr[i] = random(from, to);
    }
}

int main()
{
    std::vector<ISorter<double>*> Sorts = { new BubbleSort<double>{}, new ShakerSort<double>{}, new InsertionSort<double>{}, new SelectionSort<double>{}, new QuickSort<double>{}, new ShellSort<double>{} };
    int nSorts = Sorts.size();

    int requestType;
    std::cin >> requestType;
    if (requestType == 0) {
        int n, sortType;
        std::cin >> sortType;
        std::cin >> n;
        ArraySequence<double> sequence(n);
        for (int i = 0; i < n; i++) {
            std::cin >> sequence.Get(i);
        }
        //std::cout << &sequence << std::endl;
        auto start = std::chrono::high_resolution_clock::now();
        Sort(sequence, Sorts[sortType]);
        auto stop = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
        std::cout << &sequence << std::endl;
        std::cout << duration.count();
    }
    else if (requestType == 1) {
        int start, end, t;
        std::cin >> start >> end;
        
        for (int sortType = 0; sortType < nSorts; sortType++) {
            ArraySequence<long long> times(log2(end) - log2(start) + 1);
            t = 0;
            for (int n = start; n <= end; n *= 2) {
                ArraySequence<double> sequence(n);
                randomSequence(sequence, double(-10), double(10));
                auto start = std::chrono::high_resolution_clock::now();
                Sort(sequence, Sorts[sortType]);
                auto stop = std::chrono::high_resolution_clock::now();
                auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
                times[t] = duration.count();
                t++;
            }
            std::cout << &times << std::endl;
        }
    }
    

    // clean
    for (int i = 0; i < nSorts; i++) {
        delete Sorts[i];
    }
}
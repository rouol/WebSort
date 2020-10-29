#pragma once
#include "Sequence.h"
#include <functional>

// main class
template<typename T>
class ISorter
{
public:
	virtual void operator()(
		Sequence<T>& sequence,
		std::function<bool(const T&, const T&)> comp = [](const T& elementA, const T& elementB) { return elementA > elementB; }
	) = 0;
	virtual ~ISorter() {}
};

// child Sort classes
#include <vector>
#include <utility>


// BubbleSort
template<typename T>
class BubbleSort : public ISorter<T>
{
public:
	void operator()(Sequence<T>& sequence, std::function<bool(const T&, const T&)> comp = [](const T& x, const T& y) { return x > y; }) {
		int n = sequence.GetLength();
		if (n > 1) {
			int i, j;
			for (i = 0; i < n - 1; i++)
				for (j = 0; j < n - i - 1; j++)
					if (comp(sequence[j], sequence[j + 1]))
						sequence.Swap(j, j + 1);
		}
	}
};

// ShakerSort
template<typename T>
class ShakerSort : public ISorter<T>
{
public:
	void operator()(Sequence<T>& sequence, std::function<bool(const T&, const T&)> comp = [](const T& x, const T& y) { return x > y; }) {
		int n = sequence.GetLength();
		if (n > 1) {
			int i, j, k;
			for (i = 0; i < n;) {
				for (j = i + 1; j < n; j++) {
					if (comp(sequence[j - 1], sequence[j]))
						sequence.Swap(j, j - 1);
				}
				n--;
				for (k = n - 1; k > i; k--) {
					if (comp(sequence[k - 1], sequence[k]))
						sequence.Swap(k, k - 1);
				}
				i++;
			}
		}
	}
};

// InsertionSort
template<typename T>
class InsertionSort : public ISorter<T>
{
public:
	void operator()(Sequence<T>& sequence, std::function<bool(const T&, const T&)> comp = [](const T& x, const T& y) { return x > y; }) {
		int n = sequence.GetLength();
		if (n > 1) {
			for (int i = 1; i < n; i++)
			{
				int j = i - 1;
				while ((j >= 0) && comp(sequence[j], sequence[j + 1]))
					sequence.Swap(j, j + 1), j--;
			}
		}
	}
};

// SelectionSort
template<typename T>
class SelectionSort : public ISorter<T>
{
public:
	void operator()(Sequence<T>& sequence, std::function<bool(const T&, const T&)> comp = [](const T& x, const T& y) { return x > y; }) {
		int n = sequence.GetLength();
		if (n > 1) {
			int i, j, min_idx;
			// 1 by 1 move boundary of unsorted subarray  
			for (i = 0; i < n - 1; i++)
			{
				// Find the minimum element in unsorted array  
				min_idx = i;
				for (j = i + 1; j < n; j++)
					if (comp(sequence[min_idx], sequence[j]))
						min_idx = j;
				// Swap the found minimum element with the first element  
				sequence.Swap(min_idx, i);
			}
		}
	}
};

// QuickSort
template<typename T>
class QuickSort : public ISorter<T>
{
public:

	void quicksort(Sequence<T>& seq, int fst, int lst, std::function<bool(const T&, const T&)> comp) {
		if (fst >= lst) return;
		int i = fst;
		int j = lst;
		T pivot = seq[(fst + lst) / 2];

		while (i <= j) {
			while (comp(pivot, seq[i])) i++;
			while (comp(seq[j], pivot)) j--;
			if (i <= j) {
				seq.Swap(i, j);
				i++;
				j--;
			}
		}
		quicksort(seq, fst, j, comp);
		quicksort(seq, i, lst, comp);
	}
	
	void operator()(Sequence<T>& sequence, std::function<bool(const T&, const T&)> comp = [](const T& x, const T& y) { return x > y; }) {
		int n = sequence.GetLength();
		if (n > 1) {
			quicksort(sequence, 0, n - 1, comp);
		}
	}
};

// ShellSort
template<typename T>
class ShellSort : public ISorter<T>
{
public:

	void operator()(Sequence<T>& sequence, std::function<bool(const T&, const T&)> comp = [](const T& x, const T& y) { return x > y; }) {
		int n = sequence.GetLength();
		if (n > 1) {
			for (int spacing = n / 2; spacing > 0; spacing /= 2)
			{
				for (int i = spacing; i < n; i += 1)
				{
					T temp = sequence[i];
					int j;
					for (j = i; j >= spacing && comp(sequence[j - spacing], temp); j -= spacing)
						sequence[j] = sequence[j - spacing];
					sequence[j] = temp;	
				}
			}
		}
	}
};


/*
// CountSort
template<typename T>
class CountSort : public ISorter<T>
{
public:
	T getMax(Sequence<T> seq) {
		T max = seq[0];
		for (int i = 2; i <= seq.GetLength(); i++) {
			if (seq[i] > max)
				max = seq[i];
		}
		return max; //the max element from the array
	}

	void operator()(Sequence<T>& sequence, std::function<bool(const T&, const T&)> comp) {

		int n = sequence.GetLength();
		if (n > 1) {
			ArraySequence<int> output(n + 1);
			int max = getMax(array, n);
			ArraySequence<int> count(max + 1); //create count array (max+1 number of elements)     
			for (int i = 0; i <= max; i++)
				count[i] = 0;     //initialize count array to all zero
			for (int i = 1; i <= n; i++)
				count[array[i]]++;     //increase number count in count array.
			for (int i = 1; i <= max; i++)
				count[i] += count[i - 1];     //find cumulative frequency
			for (int i = n; i >= 1; i--) {
				output[count[array[i]]] = array[i];
				count[array[i]] -= 1; //decrease count for same numbers
			}
			for (int i = 1; i <= n; i++) {
				array[i] = output[i]; //store output array to main array
			}
		}
	}
};

*/
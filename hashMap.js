class HashMap {
  constructor(initialCapacity = 16, maxLoadFactor = 0.75) {
    this.bucketCount = initialCapacity;
    this.buckets = new Array(this.bucketCount);
    this.size = 0; // number of key-value pairs
    this.maxLoadFactor = maxLoadFactor;

    for (let i = 0; i < initialCapacity; i++) {
      this.buckets[i] = null; // can use null or empty array (depends on collision handling)
    }
  }

  hash(key, buckets) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % buckets;
    }
    return hashCode;
  }

  loadFactor() {
    return this.size / this.bucketCount;
  }

  resize() {
    const newBucketCount = this.bucketCount * 2;
    const newBuckets = new Array(newBucketCount).fill(null);
    // Rehash all entries
    this.buckets.forEach((bucket) => {
      if (bucket) {
        bucket.forEach((entry) => {
          const index = this.hash(entry.key, newBucketCount);
          if (!newBuckets[index]) {
            newBuckets[index] = [];
          }
          newBuckets[index].push(entry);
        });
      }
    });
    this.buckets = newBuckets;
    this.bucketCount = newBucketCount;
  }

  set(key, value) {
    // if key already exists, old value is overwritten (updated)
    // collision happens when two different keys share a bucket (same value), should resolve
    // grow buckets when needed by calculating if bucket has reached the load factor
    if (this.loadFactor() >= this.maxLoadFactor) {
      this.resize();
    }
    const index = this.hash(key, this.bucketCount);
    if (this.buckets[index] === null) {
      this.buckets[index] = []; // Create a new bucket if it does not exist
    }
    for (let i = 0; i < this.buckets[index].length; i++) {
      if (this.buckets[index][i].key === key) {
        this.buckets[index][i].value = value; // Update existing key
        return; // Early return to avoid duplicate key
      }
    }
    // If the key does not exist, add a new key-value pair
    this.buckets[index].push({ key: key, value: value });
    this.size++;
  }

  get(key) {
    const index = this.hash(key, this.bucketCount);
    const bucket = this.buckets[index];
    if (bucket) {
      for (const entry of bucket) {
        if (entry.key === key) {
          return entry.value;
        }
      }
    }
    return null;
  }

  has(key) {
    return this.get(key) !== null;
  }

  remove(key) {
    const index = this.hash(key, this.bucketCount);
    const bucket = this.buckets[index];
    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i].key === key) {
          bucket.splice(i, 1);
          this.size--;
          return true;
        }
      }
    }
    return false;
  }

  length() {
    return this.size;
  }

  clear() {
    this.buckets.fill(null);
    this.size = 0;
  }

  keys() {
    const keysArray = [];
    this.buckets.forEach((bucket) => {
      if (bucket) {
        bucket.forEach((entry) => {
          keysArray.push(entry.key);
        });
      }
    });
    return keysArray;
  }

  values() {
    const valuesArray = [];
    this.buckets.forEach((bucket) => {
      if (bucket) {
        bucket.forEach((entry) => valuesArray.push(entry.value));
      }
    });
    return valuesArray;
  }

  entries() {
    const entriesArray = [];
    this.buckets.forEach((bucket) => {
      if (bucket) {
        bucket.forEach((entry) => entriesArray.push([entry.key, entry.value]));
      }
    });
    return entriesArray;
  }
}

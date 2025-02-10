//
//  SimpleCache.swift
//  TooManyReviewers
//
//  Created by MeowCat on 2025/2/3.
//

class SimpleCache<K: Hashable, V> {
    private var cache = [K: V]()
    
    private let fn: (K) -> V
    
    init(fn: @escaping (K) -> V) {
        self.fn = fn
    }
    
    subscript(_ key: K) -> V {
        if let cached = cache[key] {
            return cached
        }
        let value = fn(key)
        cache[key] = value
        return value
    }
}

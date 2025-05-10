import { useEffect, useRef, useCallback } from "react";

//Learning Throttling by using it in infinite scroll
const useThrottle = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    const lastExecuted = useRef<number>(Date.now())
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    // Store the function in a ref to avoid triggering effect on function change
    const funcRef = useRef<T>(func)
    
    // Update the ref when function changes
    useEffect(() => {
        funcRef.current = func
    }, [func])
    
    const throttledFunction = useCallback((...args: Parameters<T>) => {
        const now = Date.now()
        const timeElapsed = now - lastExecuted.current
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        
        if (timeElapsed >= delay) {
            lastExecuted.current = now
            return funcRef.current(...args)
        } else {
            timeoutRef.current = setTimeout(() => {
                lastExecuted.current = Date.now()
                funcRef.current(...args)
            }, delay - timeElapsed)
        }
    }, [delay])
    
    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])
    
    return throttledFunction
}

export default useThrottle;
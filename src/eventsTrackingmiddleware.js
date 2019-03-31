import { event } from './lib'

/**
 * This tracking code detects specific actions happening within our web application
 * and triggers tracking to GTM, this sort of tracking should really be configured
 * within GTM itself but for a variety of reasons.. isn't
 */

/**
 * Normalizes a middleware stage which may be a function or an object.
 * If the stage is a function then it can just be returned; otherwise
 * it should be wrapped in a function which simply merges the base
 * event and the middleware stage
 * @param {object|function} fn
 */
function normalizeMiddleware(fn) {

    if (typeof fn === 'function') return fn;

    return current => ({ ...current, ...fn });
}

/**
 * Creates an interaction tracking function which takes a css selector, event type and then tracking
 * event to fire if an event of the given type is fired on an element matching the selector
 * @param {(object|function)[]} middleware an array of middleware handlers that are chain invoked in order to build the final event
 */
const createTracker = middleware => ({ selector, eventType = 'click', trackingEvent } = {}) => {

    // create a normalized middleware array
    const normalizedMiddleware = [...middleware, trackingEvent].map(fn => normalizeMiddleware(fn));

    addEventListener(eventType, e => {

        const element = e.target.closest(selector);

        if (element == null) return;

        // run each middleware stage
        const trackingEvent = normalizedMiddleware.reduce((trackingEvent, fn) => fn(trackingEvent, e, element), {});

        if (trackingEvent == null) return;

        event(trackingEvent);
    });

};

// element based tracking events
const baseInteractionEvent = { event: 'trackEvent' };

export default createTracker([baseInteractionEvent]);
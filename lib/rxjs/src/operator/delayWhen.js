System.register(['../Subscriber', '../Observable', '../OuterSubscriber', '../util/subscribeToResult'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1, Observable_1, OuterSubscriber_1, subscribeToResult_1;
    var DelayWhenOperator, DelayWhenSubscriber, SubscriptionDelayObservable, SubscriptionDelaySubscriber;
    /**
     * Returns an Observable that delays the emission of items from the source Observable
     * by a subscription delay and a delay selector function for each element.
     * @param {Function} selector function to retrieve a sequence indicating the delay for each given element.
     * @param {Observable} sequence indicating the delay for the subscription to the source.
     * @return {Observable} an Observable that delays the emissions of the source Observable by the specified timeout or Date.
     * @method delayWhen
     * @owner Observable
     */
    function delayWhen(delayDurationSelector, subscriptionDelay) {
        if (subscriptionDelay) {
            return new SubscriptionDelayObservable(this, subscriptionDelay)
                .lift(new DelayWhenOperator(delayDurationSelector));
        }
        return this.lift(new DelayWhenOperator(delayDurationSelector));
    }
    exports_1("delayWhen", delayWhen);
    return {
        setters:[
            function (Subscriber_1_1) {
                Subscriber_1 = Subscriber_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (OuterSubscriber_1_1) {
                OuterSubscriber_1 = OuterSubscriber_1_1;
            },
            function (subscribeToResult_1_1) {
                subscribeToResult_1 = subscribeToResult_1_1;
            }],
        execute: function() {
            DelayWhenOperator = (function () {
                function DelayWhenOperator(delayDurationSelector) {
                    this.delayDurationSelector = delayDurationSelector;
                }
                DelayWhenOperator.prototype.call = function (subscriber, source) {
                    return source._subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
                };
                return DelayWhenOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            DelayWhenSubscriber = (function (_super) {
                __extends(DelayWhenSubscriber, _super);
                function DelayWhenSubscriber(destination, delayDurationSelector) {
                    _super.call(this, destination);
                    this.delayDurationSelector = delayDurationSelector;
                    this.completed = false;
                    this.delayNotifierSubscriptions = [];
                    this.values = [];
                }
                DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
                    this.destination.next(outerValue);
                    this.removeSubscription(innerSub);
                    this.tryComplete();
                };
                DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
                    this._error(error);
                };
                DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
                    var value = this.removeSubscription(innerSub);
                    if (value) {
                        this.destination.next(value);
                    }
                    this.tryComplete();
                };
                DelayWhenSubscriber.prototype._next = function (value) {
                    try {
                        var delayNotifier = this.delayDurationSelector(value);
                        if (delayNotifier) {
                            this.tryDelay(delayNotifier, value);
                        }
                    }
                    catch (err) {
                        this.destination.error(err);
                    }
                };
                DelayWhenSubscriber.prototype._complete = function () {
                    this.completed = true;
                    this.tryComplete();
                };
                DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
                    subscription.unsubscribe();
                    var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
                    var value = null;
                    if (subscriptionIdx !== -1) {
                        value = this.values[subscriptionIdx];
                        this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
                        this.values.splice(subscriptionIdx, 1);
                    }
                    return value;
                };
                DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
                    var notifierSubscription = subscribeToResult_1.subscribeToResult(this, delayNotifier, value);
                    this.add(notifierSubscription);
                    this.delayNotifierSubscriptions.push(notifierSubscription);
                    this.values.push(value);
                };
                DelayWhenSubscriber.prototype.tryComplete = function () {
                    if (this.completed && this.delayNotifierSubscriptions.length === 0) {
                        this.destination.complete();
                    }
                };
                return DelayWhenSubscriber;
            }(OuterSubscriber_1.OuterSubscriber));
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            SubscriptionDelayObservable = (function (_super) {
                __extends(SubscriptionDelayObservable, _super);
                function SubscriptionDelayObservable(source, subscriptionDelay) {
                    _super.call(this);
                    this.source = source;
                    this.subscriptionDelay = subscriptionDelay;
                }
                SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
                    this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
                };
                return SubscriptionDelayObservable;
            }(Observable_1.Observable));
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            SubscriptionDelaySubscriber = (function (_super) {
                __extends(SubscriptionDelaySubscriber, _super);
                function SubscriptionDelaySubscriber(parent, source) {
                    _super.call(this);
                    this.parent = parent;
                    this.source = source;
                    this.sourceSubscribed = false;
                }
                SubscriptionDelaySubscriber.prototype._next = function (unused) {
                    this.subscribeToSource();
                };
                SubscriptionDelaySubscriber.prototype._error = function (err) {
                    this.unsubscribe();
                    this.parent.error(err);
                };
                SubscriptionDelaySubscriber.prototype._complete = function () {
                    this.subscribeToSource();
                };
                SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
                    if (!this.sourceSubscribed) {
                        this.sourceSubscribed = true;
                        this.unsubscribe();
                        this.source.subscribe(this.parent);
                    }
                };
                return SubscriptionDelaySubscriber;
            }(Subscriber_1.Subscriber));
        }
    }
});
//# sourceMappingURL=delayWhen.js.map
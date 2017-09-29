import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';
import { OHIF } from 'meteor/ohif:core';

const Notifications = {
    currentId: 0,
    views: new Map()
};

// Remove the view object from DOM and from views Map
const removeView = (id, view) => {
    Notifications.views.delete(id);
    Blaze.remove(view);
};

// Dismiss a single notification note by its id
Notifications.dismiss = id => {
    const view = Notifications.views.get(id);
    if (!view || view.isDestroyed) {
        return Notifications.views.delete(id);
    }

    const node = view.firstNode();
    const $note = node && $(node);

    if ($note.length) {
        $note.addClass('out').one('transitionend', () => removeView(id, view));
    } else {
        removeView(id, view)
    }
};

// Dismiss all notification notes
Notifications.clear = () => Array.from(Notifications.views.keys()).forEach(Notifications.dismiss);

// Display a notification note
Notifications.show = ({ template, promise, text, style, timeout=5000 }) => {
    // Check if the given template exists
    const templateObject = Template[template];
    if (template && !templateObject) {
        throw new Meteor.Error('TEMPLATE_NOT_FOUND', `Template ${template} not found.`);
    }

    // Check if there is a notification area container
    const $area = $('#notificationArea');
    if (!$area.length) {
        throw new Meteor.Error('NOTIFICATION_AREA_NOT_FOUND', `Notification area not found.`);
    }

    let notificationPromise;
    let templateData = {
        text,
        style,
        timeout,
        id: Notifications.currentId++
    };

    if (promise instanceof Promise) {
        // Use the given promise to control the notification
        notificationPromise = templateData.promise = promise;
    } else {
        // Create a new promise to control the modal and store its resolve and reject callbacks
        let promiseResolve;
        let promiseReject;
        notificationPromise = new Promise((resolve, reject) => {
            promiseResolve = resolve;
            promiseReject = reject;
        });

        // Render the notification passing the promise object and callbacks
        _.extend({}, templateData, {
            promise: notificationPromise,
            promiseResolve,
            promiseReject
        });
    }

    const view = Blaze.renderWithData(Template.notificationNote, templateData, $area[0]);
    const dismissNotification = () => Notifications.dismiss(templateData.id);

    // Add the current view to the list of views to allow clearing all notifications
    Notifications.views.set(templateData.id, view);

    // Destroy the created notification view when the promise is either resolved or rejected
    notificationPromise.then(dismissNotification).catch(dismissNotification);

    // Destroy the created notification view if the given timeout time has passed
    if (timeout > 0) {
        Meteor.setTimeout(() => {
            if (templateData.promiseResolve) {
                templateData.promiseResolve();
            } else {
                dismissNotification();
            }
        }, timeout);
    }

    // Return the promise to allow callbacks stacking from outside
    return notificationPromise;
};

OHIF.ui.notifications = Notifications;
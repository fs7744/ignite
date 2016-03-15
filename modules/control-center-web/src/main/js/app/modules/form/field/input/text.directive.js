/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import template from './text.jade!';
import './text.css!';

export default ['igniteFormFieldInputText', ['IgniteFormGUID', (guid) => {
    const link = (scope, el, attrs, [ngModel, form, label]) => {
        const {id, name} = scope;

        label.for = scope.id = id || guid();

        scope.ngModel = ngModel;
        scope.form = form;
        scope.label = label;

        scope.$watch('required', (required) => {
            label.required = required || false;
        });

        form.$defaults = form.$defaults || {};
        form.$defaults[name] = _.cloneDeep(scope.value);

        const setAsDefault = () => {
            if (!form.$pristine) return;

            form.$defaults = form.$defaults || {};
            form.$defaults[name] = _.cloneDeep(scope.value);
        };

        scope.$watch(() => form.$pristine, setAsDefault);
        scope.$watch('value', setAsDefault);

        scope.ngChange = function() {
            ngModel.$setViewValue(scope.value);

            if (JSON.stringify(scope.value) !== JSON.stringify(form.$defaults[name]))
                ngModel.$setDirty();
            else
                ngModel.$setPristine();

            if (ngModel.$valid)
                el.find('input').addClass('ng-valid').removeClass('ng-invalid');
            else
                el.find('input').removeClass('ng-valid').addClass('ng-invalid');
        };

        ngModel.$render = function() {
            scope.value = ngModel.$modelValue;
        };
    };

    return {
        restrict: 'E',
        scope: {
            id: '@',
            name: '@',
            placeholder: '@',
            required: '=ngRequired',
            disabled: '=ngDisabled',

            ngBlur: '&',

            autofocus: '=igniteFormFieldInputAutofocus'
        },
        link,
        template,
        replace: true,
        transclude: true,
        require: ['ngModel', '^form', '?^igniteFormField']
    };
}]];

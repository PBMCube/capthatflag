'use strict';

var _ = require('lodash')
    , utils = require('../utils')
    , ComponentBase = require('../core/component')
    , AttackComponent;

/**
 * Attack component class.
 * @class shared.components.AttackComponent
 * @classdesc Component that adds the ability to attack other entities.
 * @extends shared.core.Component
 */
AttackComponent = utils.inherit(ComponentBase, {
    /**
     * Creates a new component.
     * @constructor
     */
    constructor: function() {
        ComponentBase.apply(this);

        // inherited properties
        this.key = 'attack';
        this.phase = ComponentBase.prototype.phases.LOGIC;

        // internal properties
        this._lastAttackAt = null;
    }
    /**
     * @override
     */
    , update: function() {
        var now = _.now()
            , actions = this.owner.attrs.get('actions');

        if (_.indexOf(actions, 'attack') !== -1 && this.canAttack()) {
            this.attack();
            this._lastAttackAt = now;
        }

        // update entity attributes
        this.owner.attrs.set({
            lastAttackAt: this._lastAttackAt
        });
    }
    /**
     * Returns whether the entity can attack.
     * @method shared.components.AttackComponent#canAttack
     * @return {boolean} The result.
     */
    , canAttack: function() {
        var alive = this.owner.attrs.get('alive')
            , cooldownMsec = this.owner.attrs.get('attackCooldownMsec');
            
        return alive === true && _.isUndefined(this._lastAttackAt) || (_.now() - this._lastAttackAt) > cooldownMsec;
    }
    /**
     * Performs an attack.
     * @method shared.components.AttackComponent#attack
     */
    , attack: function() {

    }
    /**
     * Calculates where the player will hit when attacking based on its attributes.
     * @method shared.components.AttackComponent#calculateTarget
     * @return {object} Target position object.
     */
    , calculateTarget: function() {
        var target = this.owner.attrs.get(['x', 'y'])
            , dimensions = this.owner.attrs.get(['width', 'height'])
            , direction = this.owner.attrs.get('direction')
            , range = this.owner.attrs.get('attackRange')
            , halfWidth = dimensions.width / 2
            , halfHeight = dimensions.height / 2;

        // move the target on top of the attacker
        target.x += halfWidth;
        target.y += halfHeight;

        switch (direction) {
            case 'left':
                target.x -= halfWidth + range;
                break;
            case 'up':
                target.y -= halfHeight + range;
                break;
            case 'right':
                target.x += halfWidth + range;
                break;
            case 'down':
                target.y += halfHeight + range;
                break;
            default:
                break;
        }

        return target;
    }
});

module.exports = AttackComponent;

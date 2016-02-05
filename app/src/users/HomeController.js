/**
 * Created by hnatina on 11/30/15.
 */
(function(){

    angular
        .module('users')
        .controller('HomeController', [
            HomeController
        ]);

    function HomeController() {
        var self = this;

        self.streams = [
        {title: "Startups", color: "green", icon: "startups", href: "startups"},
        {title: "Leadership ...", color: "indigo", icon: "leadership", href: "startups"},
        {title: "Healthcare ...", color: "red", icon: "healthcare", href: "startups"},
        {title: "Energy ...", color: "brown", icon: "energy", href: "startups"}
        ];
    }

})();